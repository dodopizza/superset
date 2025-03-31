# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
from __future__ import annotations

import datetime
import math
from typing import Any, TYPE_CHECKING

import numpy as np
import pandas as pd

if TYPE_CHECKING:
    from superset.common.query_object import QueryObject


def left_join_df(
    left_df: pd.DataFrame,
    right_df: pd.DataFrame,
    join_keys: list[str],
    lsuffix: str = "",
    rsuffix: str = "",
) -> pd.DataFrame:
    df = left_df.set_index(join_keys).join(
        right_df.set_index(join_keys), lsuffix=lsuffix, rsuffix=rsuffix
    )
    df.reset_index(inplace=True)
    return df


def full_outer_join_df(
    left_df: pd.DataFrame,
    right_df: pd.DataFrame,
    lsuffix: str = "",
    rsuffix: str = "",
) -> pd.DataFrame:
    df = left_df.join(right_df, lsuffix=lsuffix, rsuffix=rsuffix, how="outer")
    df.reset_index(inplace=True)
    return df


def df_metrics_to_num(df: pd.DataFrame, query_object: QueryObject) -> None:
    """Converting metrics to numeric when pandas.read_sql cannot"""
    for col, dtype in df.dtypes.items():
        if dtype.type == np.object_ and col in query_object.metric_names:
            # soft-convert a metric column to numeric
            # will stay as strings if conversion fails
            df[col] = df[col].infer_objects()


def is_datetime_series(series: Any) -> bool:
    if series is None or not isinstance(series, pd.Series):
        return False

    if series.isnull().all():
        return False

    return pd.api.types.is_datetime64_any_dtype(series) or (
        series.apply(lambda x: isinstance(x, datetime.date) or x is None).all()
    )


def convert_to_time(value: Any) -> str:
    if isinstance(value, (int, float)) and not math.isnan(value):
        total_seconds = int(value // 1000)
        hours, remainder = divmod(total_seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        return f"{hours:02}:{minutes:02}:{seconds:02}"
    if isinstance(value, str):
        return value
    return "00:00:00"


def format_data_for_export(
    df: pd.DataFrame, form_data: dict[str, Any] | None = None
) -> pd.DataFrame:
    form_data = form_data or {}

    export_as_time = form_data.get(
        "export_as_time"
    )  # с фронта приходит поле "export_as_time", если тип графика big number и значение нужно экспортнуть как время
    column_config = form_data.get(
        "column_config", {}
    )  # с фронта приходит словарь, где лежат словари, в которых возможно есть поле "export_as_time", если значение нужно экспортнуть как время, используется во всех остальных типах графиков
    table_order_by = form_data.get(
        "table_order_by", {}
    )  # используем для сортировки данных, приходит словарь, где ключ это колонка, по которому отсортировали, а значение это в каком порядке было отсортировано

    if export_as_time:  # экспорт в формате времени
        key_column = df.keys()[0]
        df[key_column] = df[key_column].apply(convert_to_time)

    metric_map = {  # получаем данные с фронта о метриках, чтобы корректно переводить колонки на русский язык при выгрузке
        m.get("metric_name"): m.get("verbose_name")
        for m in form_data.get("datasource_metrics", [])
    }

    for k, v in column_config.items():  # экспорт в формате времени
        if v.get("exportAsTime"):
            if isinstance(df.get(k), pd.Series):
                df[k] = df[k].apply(convert_to_time)
            if isinstance(df.get(metric_map.get(k)), pd.Series):
                df[metric_map.get(k)] = df[metric_map.get(k)].apply(convert_to_time)

    # Сортировка данных
    for column, order in table_order_by.items():
        if column in df.columns:
            df.sort_values(by=[column], ascending=(order == "asc"), inplace=True)

    return df
