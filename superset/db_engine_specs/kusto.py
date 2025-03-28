# DODO was here
import re
from datetime import datetime
from typing import Any, Optional, Dict
import time
import types as py_types

from sqlalchemy import types as sqla_types
from sqlalchemy.dialects.mssql.base import SMALLDATETIME
from sqlalchemy.pool import QueuePool

from superset.constants import TimeGrain
from superset.db_engine_specs.base import BaseEngineSpec, LimitMethod
from superset.db_engine_specs.exceptions import (
    SupersetDBAPIDatabaseError,
    SupersetDBAPIOperationalError,
    SupersetDBAPIProgrammingError,
)
from superset.sql_parse import ParsedQuery
from superset.utils.core import GenericDataType

# Directly import GunicornPrometheusLogger from configs
from configs.gunicorn_infrastructure.prometheus import GunicornPrometheusLogger

# Create a minimal config object for GunicornPrometheusLogger
dummy_cfg = py_types.SimpleNamespace(
    statsd_prefix="superset_gunicorn",
    loglevel="info",
    capture_output=None,
    errorlog=None,
    user=None,
    group=None,
    accesslog=None,
    access_log_format=None,
    syslog=False,
    syslog_prefix=False,
    syslog_facility="",
    syslog_addr="",
    proc_name="",
    logconfig_dict=None,
    logconfig_json=None,
    logconfig=None,
    disable_redirect_access_to_syslog=None,
)
logger = GunicornPrometheusLogger(dummy_cfg)

# Log to confirm kusto.py initialization
logger.warning("Kusto engine specs initialized with GunicornPrometheusLogger")

class KustoSqlEngineSpec(BaseEngineSpec):
    limit_method = LimitMethod.WRAP_SQL
    engine = "kustosql"
    engine_name = "KustoSQL"
    time_groupby_inline = True
    time_secondary_columns = True
    allows_joins = True
    allows_subqueries = True
    allows_sql_comments = False

    _time_grain_expressions = {
        None: "{col}",
        TimeGrain.SECOND: "DATEADD(second, DATEDIFF(second, '2000-01-01', {col}), '2000-01-01')",
        TimeGrain.MINUTE: "DATEADD(minute, DATEDIFF(minute, 0, {col}), 0)",
        TimeGrain.FIVE_MINUTES: "DATEADD(minute, DATEDIFF(minute, 0, {col}) / 5 * 5, 0)",
        TimeGrain.TEN_MINUTES: "DATEADD(minute, DATEDIFF(minute, 0, {col}) / 10 * 10, 0)",
        TimeGrain.FIFTEEN_MINUTES: "DATEADD(minute, DATEDIFF(minute, 0, {col}) / 15 * 15, 0)",
        TimeGrain.HALF_HOUR: "DATEADD(minute, DATEDIFF(minute, 0, {col}) / 30 * 30, 0)",
        TimeGrain.HOUR: "DATEADD(hour, DATEDIFF(hour, 0, {col}), 0)",
        TimeGrain.DAY: "DATEADD(day, DATEDIFF(day, 0, {col}), 0)",
        TimeGrain.WEEK: "DATEADD(day, -1, DATEADD(week, DATEDIFF(week, 0, {col}), 0))",
        TimeGrain.MONTH: "DATEADD(month, DATEDIFF(month, 0, {col}), 0)",
        TimeGrain.QUARTER: "DATEADD(quarter, DATEDIFF(quarter, 0, {col}), 0)",
        TimeGrain.YEAR: "DATEADD(year, DATEDIFF(year, 0, {col}), 0)",
        TimeGrain.WEEK_STARTING_SUNDAY: "DATEADD(day, -1, DATEADD(week, DATEDIFF(week, 0, {col}), 0))",
        TimeGrain.WEEK_STARTING_MONDAY: "DATEADD(week, DATEDIFF(week, 0, DATEADD(day, -1, {col})), 0)",
    }

    type_code_map: dict[int, str] = {}
    column_type_mappings = (
        (re.compile(r"^smalldatetime.*", re.IGNORECASE), SMALLDATETIME(), GenericDataType.TEMPORAL,),
    )

    @classmethod
    def get_dbapi_exception_mapping(cls) -> dict[type[Exception], type[Exception]]:
        """Map Kusto-specific exceptions to Superset exceptions"""
        import sqlalchemy_kusto.errors as kusto_exceptions
        return {
            kusto_exceptions.DatabaseError: SupersetDBAPIDatabaseError,
            kusto_exceptions.OperationalError: SupersetDBAPIOperationalError,
            kusto_exceptions.ProgrammingError: SupersetDBAPIProgrammingError,
        }

    @classmethod
    def convert_dttm(cls, target_type: str, dttm: datetime, db_extra: Optional[dict[str, Any]] = None) -> Optional[str]:
        """Convert datetime to Kusto SQL format"""
        sqla_type = cls.get_sqla_column_type(target_type)
        try:
            if isinstance(sqla_type, types.Date):
                return f"CONVERT(DATE, '{dttm.date().isoformat()}', 23)"
            if isinstance(sqla_type, types.TIMESTAMP):
                datetime_formatted = dttm.isoformat(sep=" ", timespec="seconds")
                return f"CONVERT(TIMESTAMP, '{datetime_formatted}', 20)"
            if isinstance(sqla_type, SMALLDATETIME):
                datetime_formatted = dttm.isoformat(sep=" ", timespec="seconds")
                return f"CONVERT(SMALLDATETIME, '{datetime_formatted}', 20)"
            if isinstance(sqla_type, types.DateTime):
                datetime_formatted = dttm.isoformat(timespec="milliseconds")
                return f"CONVERT(DATETIME, '{datetime_formatted}', 126)"
            return None
        except Exception as e:
            logger.error(f"Error converting datetime: {str(e)}")
            return None

    @classmethod
    def is_readonly_query(cls, parsed_query: ParsedQuery) -> bool:
        """Check if the query is read-only"""
        return parsed_query.sql.lower().startswith("select")

    @classmethod
    def customize_engine(cls, engine_options: Dict[str, Any]) -> Dict[str, Any]:
        """Configure SQLAlchemy engine with QueuePool"""
        default_options = {
            "poolclass": QueuePool,
            "pool_size": 30,
            "max_overflow": 20,
            "pool_recycle": 120,
            "pool_pre_ping": True,
            "connect_args": {"connect_timeout": 5},
        }
        engine_options = {**default_options, **engine_options}
        engine_options["poolclass"] = QueuePool  # Enforce QueuePool
        return engine_options

    @classmethod
    def execute(cls, query: str, **kwargs):
        """Execute a query with metrics logging using QueuePool"""
        engine = kwargs.get("engine")
        if not engine:
            raise ValueError("Engine not provided for query execution")

        pool_type = "QueuePool"
        start_time = time.time()

        try:
            with engine.connect() as conn:
                # Log connection acquisition time
                conn_start = time.time()
                acquisition_time_ms = (time.time() - conn_start) * 1000
                logger.log_db_connection_acquired("kustosql", pool_type, acquisition_time_ms)

                # Log active connections with fallback
                try:
                    active_conns = engine.pool.checkedout()
                except AttributeError:
                    active_conns = 0  # Fallback if checkedout() isn’t supported
                logger.log_db_connection_active("kustosql", pool_type, active_conns)

                # Check for pool overflow
                pool_size = engine.pool.size()
                max_overflow = engine.pool._max_overflow if hasattr(engine.pool, '_max_overflow') else 20
                if active_conns > pool_size + max_overflow:
                    logger.log_db_connection_overflow("kustosql", pool_type)

                # Execute the query
                cursor = conn.execute(query)
                query_duration_ms = (time.time() - start_time) * 1000
                logger.log_db_query_duration("kustosql", pool_type, query_duration_ms)

                return cursor
        except Exception as e:
            error_type = type(e).__name__
            logger.log_db_connection_error("kustosql", pool_type, error_type)
            raise


class KustoKqlEngineSpec(BaseEngineSpec):
    limit_method = LimitMethod.WRAP_SQL
    engine = "kustokql"
    engine_name = "KustoKQL"
    time_groupby_inline = True
    time_secondary_columns = True
    allows_joins = True
    allows_subqueries = True
    allows_sql_comments = False
    run_multiple_statements_as_one = True

    _time_grain_expressions = {
        None: "{col}",
        TimeGrain.SECOND: "{col}/ time(1s)",
        TimeGrain.MINUTE: "{col}/ time(1min)",
        TimeGrain.FIVE_MINUTES: "{col}/ time(5min)",
        TimeGrain.TEN_MINUTES: "{col}/ time(10min)",
        TimeGrain.FIFTEEN_MINUTES: "{col}/ time(15min)",
        TimeGrain.HALF_HOUR: "{col}/ time(30min)",
        TimeGrain.HOUR: "{col}/ time(1h)",
        TimeGrain.DAY: "{col}/ time(1d)",
        TimeGrain.WEEK: "{col}/ time(7d)",
        TimeGrain.MONTH: "datetime_diff('month', {col}, datetime(0001-01-01 00:00:00))+1",
        TimeGrain.QUARTER: "datetime_diff('quarter', {col}, datetime(0001-01-01 00:00:00))+1",
        TimeGrain.YEAR: "datetime_diff('year', {col}, datetime(0001-01-01 00:00:00))+1",
        TimeGrain.WEEK_STARTING_SUNDAY: "{col}/ time(7d)",
        TimeGrain.WEEK_STARTING_MONDAY: "startofweek({col}, 1)",
    }

    type_code_map: dict[int, str] = {}

    @classmethod
    def get_dbapi_exception_mapping(cls) -> dict[type[Exception], type[Exception]]:
        """Map Kusto-specific exceptions to Superset exceptions"""
        import sqlalchemy_kusto.errors as kusto_exceptions
        return {
            kusto_exceptions.DatabaseError: SupersetDBAPIDatabaseError,
            kusto_exceptions.OperationalError: SupersetDBAPIOperationalError,
            kusto_exceptions.ProgrammingError: SupersetDBAPIProgrammingError,
        }

    @classmethod
    def convert_dttm(cls, target_type: str, dttm: datetime, db_extra: Optional[dict[str, Any]] = None) -> Optional[str]:
        """Convert datetime to Kusto KQL format"""
        sqla_type = cls.get_sqla_column_type(target_type)
        try:
            if isinstance(sqla_type, types.Date):
                return f"datetime({dttm.date().isoformat()})"
            if isinstance(sqla_type, types.DateTime):
                return f"datetime({dttm.isoformat(timespec='microseconds')})"
            return None
        except Exception as e:
            logger.error(f"Error converting datetime in KQL: {str(e)}")
            return None

    @classmethod
    def is_readonly_query(cls, parsed_query: ParsedQuery) -> bool:
        """Check if the query is read-only"""
        return cls.is_select_query(parsed_query) or parsed_query.sql.startswith(".show")

    @classmethod
    def is_select_query(cls, parsed_query: ParsedQuery) -> bool:
        """Check if the query is a select query"""
        return not parsed_query.sql.startswith(".")

    @classmethod
    def parse_sql(cls, sql: str) -> list[str]:
        """Parse SQL into a list of statements"""
        return [sql]

    @classmethod
    def customize_engine(cls, engine_options: Dict[str, Any]) -> Dict[str, Any]:
        """Configure SQLAlchemy engine with QueuePool"""
        default_options = {
            "poolclass": QueuePool,
            "pool_size": 30,
            "max_overflow": 20,
            "pool_recycle": 120,
            "pool_pre_ping": True,
            "connect_args": {"connect_timeout": 5},
        }
        engine_options = {**default_options, **engine_options}
        engine_options["poolclass"] = QueuePool  # Enforce QueuePool
        return engine_options

    @classmethod
    def execute(cls, query: str, **kwargs):
        """Execute a query with metrics logging using QueuePool"""
        engine = kwargs.get("engine")
        if not engine:
            raise ValueError("Engine not provided for query execution")

        pool_type = "QueuePool"
        start_time = time.time()

        try:
            with engine.connect() as conn:
                # Log connection acquisition time
                conn_start = time.time()
                acquisition_time_ms = (time.time() - conn_start) * 1000
                logger.log_db_connection_acquired("kustokql", pool_type, acquisition_time_ms)

                # Log active connections with fallback
                try:
                    active_conns = engine.pool.checkedout()
                except AttributeError:
                    active_conns = 0  # Fallback if checkedout() isn’t supported
                logger.log_db_connection_active("kustokql", pool_type, active_conns)

                # Check for pool overflow
                pool_size = engine.pool.size()
                max_overflow = engine.pool._max_overflow if hasattr(engine.pool, '_max_overflow') else 20
                if active_conns > pool_size + max_overflow:
                    logger.log_db_connection_overflow("kustokql", pool_type)

                # Execute the query
                cursor = conn.execute(query)
                query_duration_ms = (time.time() - start_time) * 1000
                logger.log_db_query_duration("kustokql", pool_type, query_duration_ms)

                return cursor
        except Exception as e:
            error_type = type(e).__name__
            logger.log_db_connection_error("kustokql", pool_type, error_type)
            raise