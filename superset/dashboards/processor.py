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
"""Defines the templating context for SQL Lab"""
from typing import (
    Any,
    Dict,
)

from jinja2 import DebugUndefined
from jinja2.sandbox import SandboxedEnvironment

from superset.utils.memoized import memoized
from flask import current_app

NONE_TYPE = type(None).__name__
ALLOWED_TYPES = (
    NONE_TYPE,
    "bool",
    "str",
    "unicode",
    "int",
    "long",
    "float",
    "list",
    "dict",
    "tuple",
    "set",
)


@memoized
def context_addons() -> Dict[str, Any]:
    return current_app.config.get("JINJA_CONTEXT_ADDONS", {})


class JsonMetadataTemplateProcessor:
    def __init__(
        self,
        **kwargs: Any,
    ) -> None:
        self._context: Dict[str, Any] = {}
        self._env = SandboxedEnvironment(undefined=DebugUndefined)
        self.set_context(**kwargs)

    def set_context(self, **kwargs: Any) -> None:
        self._context.update(kwargs)
        self._context.update(context_addons())

    def process_template(self, sql: str, **kwargs: Any) -> str:
        template = self._env.from_string(sql)
        kwargs.update(self._context)

        return template.render(kwargs)


def get_processor(**kwargs: Any) -> JsonMetadataTemplateProcessor:
    return JsonMetadataTemplateProcessor(**kwargs)
