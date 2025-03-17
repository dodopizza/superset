# DODO added
import re
from datetime import datetime
from typing import Any, Optional, Dict

from sqlalchemy import types
from sqlalchemy.dialects.mssql.base import SMALLDATETIME
from sqlalchemy.pool import NullPool  # NEW: Import for connection pooling adjustment

from superset.constants import TimeGrain
from superset.db_engine_specs.base import BaseEngineSpec, LimitMethod
from superset.db_engine_specs.exceptions import (
    SupersetDBAPIDatabaseError,
    SupersetDBAPIOperationalError,
    SupersetDBAPIProgrammingError,
)
from superset.sql_parse import ParsedQuery
from superset.utils.core import GenericDataType


class KustoSqlEngineSpec(BaseEngineSpec):
    limit_method = LimitMethod.WRAP_SQL
    engine = "kustosql"
    engine_name = "KustoSQL"
    time_groupby_inline = True
    time_secondary_columns = True
    allows_joins = True  # Kusto SQL supports limited joins
    allows_subqueries = True
    allows_sql_comments = False
    max_column_name_length = 128  # NEW: Kusto limit for column names

    # Updated time grain expressions to align with Kusto SQL and your denylist
    _time_grain_expressions = {
        None: "{col}",
        TimeGrain.DAY: "DATEADD(day, DATEDIFF(day, 0, {col}), 0)",
        TimeGrain.WEEK: "DATEADD(day, -1, DATEADD(week, DATEDIFF(week, 0, {col}), 0))",
        TimeGrain.MONTH: "DATEADD(month, DATEDIFF(month, 0, {col}), 0)",
        TimeGrain.QUARTER: "DATEADD(quarter, DATEDIFF(quarter, 0, {col}), 0)",
        TimeGrain.YEAR: "DATEADD(year, DATEDIFF(year, 0, {col}), 0)",
        TimeGrain.WEEK_STARTING_SUNDAY: "DATEADD(day, -1, DATEADD(week, DATEDIFF(week, 0, {col}), 0))",
        TimeGrain.WEEK_STARTING_MONDAY: "DATEADD(week, DATEDIFF(week, 0, DATEADD(day, -1, {col})), 0)",
    }

    type_code_map: Dict[int, str] = {}  # Loaded from get_datatype if needed

    column_type_mappings = (
        (
            re.compile(r"^smalldatetime.*", re.IGNORECASE),
            SMALLDATETIME(),
            GenericDataType.TEMPORAL,
        ),
    )

    @classmethod
    def get_dbapi_exception_mapping(cls) -> Dict[type[Exception], type[Exception]]:
        import sqlalchemy_kusto.errors as kusto_exceptions
        return {
            kusto_exceptions.DatabaseError: SupersetDBAPIDatabaseError,
            kusto_exceptions.OperationalError: SupersetDBAPIOperationalError,
            kusto_exceptions.ProgrammingError: SupersetDBAPIProgrammingError,
        }

    @classmethod
    def adjust_engine_params(cls, uri, connect_args, catalog=None, schema=None) -> tuple:
        # NEW: Disable pooling for Kusto's HTTP-based client
        connect_args["poolclass"] = NullPool
        if schema:
            connect_args["database"] = schema
        return uri, connect_args

    @classmethod
    def convert_dttm(
        cls, target_type: str, dttm: datetime, db_extra: Optional[Dict[str, Any]] = None
    ) -> Optional[str]:
        sqla_type = cls.get_sqla_column_type(target_type)
        if isinstance(sqla_type, types.Date):
            return f"CONVERT(DATE, '{dttm.date().isoformat()}', 23)"
        if isinstance(sqla_type, types.TIMESTAMP):
            datetime_formatted = dttm.isoformat(sep=" ", timespec="microseconds")  # CHANGED: Higher precision
            return f"CONVERT(DATETIME2, '{datetime_formatted}', 126)"  # CHANGED: DATETIME2 for Kusto compatibility
        if isinstance(sqla_type, SMALLDATETIME):
            datetime_formatted = dttm.isoformat(sep=" ", timespec="seconds")
            return f"CONVERT(SMALLDATETIME, '{datetime_formatted}', 20)"
        if isinstance(sqla_type, types.DateTime):
            datetime_formatted = dttm.isoformat(timespec="microseconds")
            return f"CONVERT(DATETIME2, '{datetime_formatted}', 126)"  # CHANGED: DATETIME2
        return None

    @classmethod
    def is_readonly_query(cls, parsed_query: ParsedQuery) -> bool:
        """Pessimistic readonly check"""
        sql = parsed_query.sql.lower()
        return sql.startswith("select") or sql.startswith(".show")

    @classmethod
    def get_timeout(cls) -> int:
        # NEW: Respect SUPERSET_WEBSERVER_TIMEOUT (120s)
        return 120


class KustoKqlEngineSpec(BaseEngineSpec):
    limit_method = LimitMethod.WRAP_SQL  # CHANGED: Consider FETCH_FIRST for KQL's 'take'
    engine = "kustokql"
    engine_name = "KustoKQL"
    time_groupby_inline = True
    time_secondary_columns = True
    allows_joins = True  # KQL supports joins via 'join' operator
    allows_subqueries = True
    allows_sql_comments = False
    run_multiple_statements_as_one = True
    max_column_name_length = 128  # NEW: Kusto limit

    # Updated time grains for KQL, respecting denylist
    _time_grain_expressions = {
        None: "{col}",
        TimeGrain.DAY: "bin({col}, 1d)",
        TimeGrain.WEEK: "bin({col}, 7d)",
        TimeGrain.MONTH: "startofmonth({col})",
        TimeGrain.QUARTER: "bin({col}, 3mon)",  # Approximate, KQL lacks direct quarter support
        TimeGrain.YEAR: "startofyear({col})",
    }

    type_code_map: Dict[int, str] = {}  # Loaded from get_datatype if needed

    @classmethod
    def get_dbapi_exception_mapping(cls) -> Dict[type[Exception], type[Exception]]:
        import sqlalchemy_kusto.errors as kusto_exceptions
        return {
            kusto_exceptions.DatabaseError: SupersetDBAPIDatabaseError,
            kusto_exceptions.OperationalError: SupersetDBAPIOperationalError,
            kusto_exceptions.ProgrammingError: SupersetDBAPIProgrammingError,
        }

    @classmethod
    def adjust_engine_params(cls, uri, connect_args, catalog=None, schema=None) -> tuple:
        # NEW: Disable pooling for Kusto
        connect_args["poolclass"] = NullPool
        if schema:
            connect_args["database"] = schema
        return uri, connect_args

    @classmethod
    def convert_dttm(
        cls, target_type: str, dttm: datetime, db_extra: Optional[Dict[str, Any]] = None
    ) -> Optional[str]:
        sqla_type = cls.get_sqla_column_type(target_type)
        if isinstance(sqla_type, types.Date):
            return f"datetime('{dttm.date().isoformat()}')"
        if isinstance(sqla_type, types.DateTime):
            return f"datetime('{dttm.isoformat(timespec='microseconds')}')"
        return None

    @classmethod
    def is_readonly_query(cls, parsed_query: ParsedQuery) -> bool:
        sql = parsed_query.sql.strip()
        return cls.is_select_query(parsed_query) or sql.startswith(".show")

    @classmethod
    def is_select_query(cls, parsed_query: ParsedQuery) -> bool:
        sql = parsed_query.sql.strip().lower()
        # CHANGED: Better KQL select detection
        return not sql.startswith(".") and ("|" not in sql or "summarize" in sql or "where" in sql)

    @classmethod
    def parse_sql(cls, sql: str) -> list[str]:
        return [sql]

    @classmethod
    def get_timeout(cls) -> int:
        # NEW: Respect SUPERSET_WEBSERVER_TIMEOUT (120s)
        return 120