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
import json
from unittest import mock

from superset.db_engine_specs.kustokql import KustoKqlEngineSpec
from superset.errors import ErrorLevel, SupersetError, SupersetErrorType
from superset.models.core import Database
from superset.models.sql_lab import Query
from tests.integration_tests.db_engine_specs.base_tests import TestDbEngineSpec


class TestKustoDbEngineSpec(TestDbEngineSpec):

    def test_convert_dttm(self):
        dttm = self.get_dttm() # datetime.strptime("2019-01-02 03:04:05.678900", "%Y-%m-%d %H:%M:%S.%f")


        test_cases = {
            "DATE": "datetime('2019-01-02')",
            "DATETIME": "datetime('2019-01-02T03:04:05.678900')",
            "TIMESTAMP": "date('2019-01-02T03:04:05.678900')",
        }

        for type_, expected in test_cases.items():
            self.assertEqual(KustoKqlEngineSpec.convert_dttm(type_, dttm), expected)

    def test_database_connection_test_mutator(self):
        database = Database(sqlalchemy_uri="kustosql+https://test")
        KustoKqlEngineSpec.mutate_db_for_connection_test(database)
        engine_params = json.loads(database.extra or "{}")

        self.assertDictEqual(
            {"engine_params": {"connect_args": {"validate_default_parameters": True}}},
            engine_params,
        )
