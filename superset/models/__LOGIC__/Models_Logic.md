# Документация по моделям (Models) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные модели](#основные-модели)
   - [Core](#core)
   - [Dashboard](#dashboard)
   - [Slice](#slice)
   - [SqlaTable](#sqlatable)
   - [Database](#database)
   - [SQL Lab](#sql-lab)
4. [DODO-специфичные модели и модификации](#dodo-специфичные-модели-и-модификации)
   - [UserInfo](#userinfo)
   - [Team](#team)
   - [FilterSet](#filterset)
   - [Log](#log)
   - [Dashboard (модификации)](#dashboard-модификации)
5. [Техническая реализация](#техническая-реализация)
6. [Примеры использования](#примеры-использования)

## Введение

Модуль `models` содержит определения моделей данных для Superset, которые используются для взаимодействия с базой данных. Модели реализованы с использованием SQLAlchemy ORM (Object-Relational Mapping), что позволяет работать с базой данных через объекты Python.

В DODO этот модуль был расширен для поддержки дополнительной функциональности, такой как локализация, онбординг пользователей, команды и наборы фильтров.

## Архитектура

Модуль `models` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - импортирует основные модули
   - `core.py` - содержит основные модели, такие как Database, Log, FavStar
   - `dashboard.py` - содержит модель Dashboard и связанные с ней модели
   - `slice.py` - содержит модель Slice (чарт)
   - `sql_lab.py` - содержит модели для SQL Lab
   - `helpers.py` - содержит вспомогательные классы и функции для моделей

2. **DODO-специфичные файлы**:
   - `user_info.py` - содержит модель UserInfo для хранения дополнительной информации о пользователе
   - `team.py` - содержит модель Team для управления командами
   - `filter_set.py` - содержит модель FilterSet для наборов фильтров

3. **Вспомогательные файлы**:
   - `annotations.py` - содержит модели для аннотаций
   - `cache.py` - содержит модели для кэширования
   - `dynamic_plugins.py` - содержит модели для динамических плагинов
   - `embedded_dashboard.py` - содержит модели для встраиваемых дашбордов
   - `statement.py` - содержит модели для заявок
   - `user_attributes.py` - содержит модели для атрибутов пользователя

## Основные модели

### Core

**Описание**: Основные модели Superset, такие как Database, Log, FavStar.

**Основные классы**:
- `Database` - модель для баз данных
- `Log` - модель для логирования действий пользователей
- `FavStar` - модель для избранных объектов
- `CssTemplate` - модель для CSS-шаблонов
- `KeyValue` - модель для хранения пар ключ-значение

**Пример использования**:
```python
from superset.models.core import Database

# Получение базы данных по ID
database = db.session.query(Database).filter_by(id=1).one()

# Получение URI базы данных
uri = database.sqlalchemy_uri
```

### Dashboard

**Описание**: Модель для дашбордов Superset.

**Основные классы**:
- `Dashboard` - модель для дашбордов
- `DashboardRoles` - связь между дашбордами и ролями

**Пример использования**:
```python
from superset.models.dashboard import Dashboard

# Получение дашборда по ID
dashboard = db.session.query(Dashboard).filter_by(id=1).one()

# Получение заголовка дашборда
title = dashboard.dashboard_title
```

### Slice

**Описание**: Модель для чартов (слайсов) Superset.

**Основные классы**:
- `Slice` - модель для чартов

**Пример использования**:
```python
from superset.models.slice import Slice

# Получение чарта по ID
slice = db.session.query(Slice).filter_by(id=1).one()

# Получение названия чарта
name = slice.slice_name
```

### SqlaTable

**Описание**: Модель для таблиц SQL Alchemy.

**Основные классы**:
- `SqlaTable` - модель для таблиц
- `TableColumn` - модель для колонок таблицы
- `SqlMetric` - модель для метрик таблицы

**Пример использования**:
```python
from superset.connectors.sqla.models import SqlaTable

# Получение таблицы по ID
table = db.session.query(SqlaTable).filter_by(id=1).one()

# Получение названия таблицы
name = table.table_name
```

### Database

**Описание**: Модель для баз данных Superset.

**Основные классы**:
- `Database` - модель для баз данных

**Пример использования**:
```python
from superset.models.core import Database

# Получение базы данных по ID
database = db.session.query(Database).filter_by(id=1).one()

# Получение URI базы данных
uri = database.sqlalchemy_uri
```

### SQL Lab

**Описание**: Модели для SQL Lab.

**Основные классы**:
- `Query` - модель для запросов
- `SavedQuery` - модель для сохраненных запросов
- `TabState` - модель для состояния вкладок
- `TableSchema` - модель для схемы таблицы

**Пример использования**:
```python
from superset.models.sql_lab import SavedQuery

# Получение сохраненного запроса по ID
query = db.session.query(SavedQuery).filter_by(id=1).one()

# Получение SQL-запроса
sql = query.sql
```

## DODO-специфичные модели и модификации

### UserInfo

**Описание**: Модель для хранения дополнительной информации о пользователе, специфичной для DODO.

**Основные поля**:
- `is_onboarding_finished` - флаг завершения онбординга (добавлено в рамках задачи #32839638)
- `onboarding_started_time` - время начала онбординга (добавлено в рамках задачи #32839638)
- `language` - язык пользователя (по умолчанию "ru")
- `data_auth_dodo` - данные авторизации DODO
- `country_num` - номер страны
- `country_name` - название страны
- `dodo_role` - роль пользователя в DODO

**Пример использования**:
```python
from superset.models.user_info import UserInfo

# Получение информации о пользователе по ID
user_info = db.session.query(UserInfo).filter_by(user_id=1).one_or_none()

# Получение роли пользователя в DODO
dodo_role = user_info.dodo_role if user_info else None
```

### Team

**Описание**: Модель для управления командами в DODO.

**Основные поля**:
- `name` - название команды
- `is_external` - флаг внешней команды
- `slug` - уникальный идентификатор команды
- `roles` - связь с ролями
- `participants` - связь с пользователями

**Пример использования**:
```python
from superset.models.team import Team

# Получение команды по ID
team = db.session.query(Team).filter_by(id=1).one()

# Получение участников команды
participants = team.participants
```

### FilterSet

**Описание**: Модель для наборов фильтров в DODO (добавлено в рамках задачи #44211751).

**Основные поля**:
- `name` - название набора фильтров
- `description` - описание набора фильтров
- `json_metadata` - метаданные набора фильтров в формате JSON
- `dashboard_id` - ID дашборда
- `user_id` - ID пользователя
- `is_primary` - флаг основного набора фильтров

**Пример использования**:
```python
from superset.models.filter_set import FilterSet

# Получение набора фильтров по ID
filter_set = db.session.query(FilterSet).filter_by(id=1).one()

# Получение метаданных набора фильтров
metadata = filter_set.json_metadata
```

### Log

**Описание**: Модель для логирования действий пользователей, расширенная для DODO.

**Основные поля**:
- `action` - действие пользователя
- `user_id` - ID пользователя
- `dashboard_id` - ID дашборда
- `slice_id` - ID чарта
- `json` - дополнительные данные в формате JSON
- `dttm` - дата и время действия
- `duration_ms` - длительность действия в миллисекундах
- `referrer` - реферер
- `is_plugin` - флаг плагина (добавлено в рамках задачи #44934342)

**Пример использования**:
```python
from superset.models.core import Log

# Получение логов пользователя
logs = db.session.query(Log).filter_by(user_id=1).all()

# Получение действий пользователя
actions = [log.action for log in logs]
```

### Dashboard (модификации)

**Описание**: Модификации модели Dashboard для DODO.

**Основные модификации**:
- `dashboard_title_ru` - заголовок дашборда на русском языке (добавлено в рамках задачи #44120746)
- `_filter_sets` - связь с наборами фильтров (добавлено в рамках задачи #44211751)

**Пример использования**:
```python
from superset.models.dashboard import Dashboard

# Получение дашборда по ID
dashboard = db.session.query(Dashboard).filter_by(id=1).one()

# Получение заголовка дашборда на русском языке
title_ru = dashboard.dashboard_title_ru

# Получение наборов фильтров дашборда
filter_sets = dashboard._filter_sets
```

## Техническая реализация

### UserInfo

```python
class UserInfo(Model):  # pylint: disable=too-few-public-methods
    """Extra info about user"""

    __tablename__ = "user_info"

    id = Column(Integer, primary_key=True)
    is_onboarding_finished = Column(Boolean, default=False)  # DODO added #32839638
    onboarding_started_time = Column(DateTime, nullable=True)  # DODO added #32839638
    language = Column(String(32), default="ru")
    user_id = Column(Integer, ForeignKey("ab_user.id"))
    user = relationship(
        security_manager.user_model,
        backref=backref("user_info", uselist=False, lazy="joined"),
    )
    data_auth_dodo = Column(utils.MediumText())
    country_num = Column(Integer, nullable=True)
    country_name = Column(String, nullable=True)
    dodo_role = Column(String(32), nullable=True)
```

### Team

```python
team_users = Table(
    "team_users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("team_id", Integer, ForeignKey("teams.id", ondelete="CASCADE")),
    Column("user_id", Integer, ForeignKey("ab_user.id", ondelete="CASCADE")),
)


class Team(Model):  # pylint: disable=too-few-public-methods
    """Dodo teams for Superset"""

    __tablename__ = "teams"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    is_external = Column(Boolean, nullable=False)
    slug = Column(String, unique=True)
    roles = relationship(security_manager.role_model, secondary=team_roles)
    participants = relationship(
        security_manager.user_model,
        secondary=team_users,
        passive_deletes=True,
        backref="teams",
    )
```

### FilterSet

```python
class FilterSet(Model, AuditMixinNullable):
    __tablename__ = "filter_sets"
    id = Column(Integer, primary_key=True)
    name = Column(String(500), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    json_metadata = Column(Text, nullable=False)
    dashboard_id = Column(Integer, ForeignKey("dashboards.id"))
    dashboard = relationship("Dashboard", back_populates="_filter_sets")
    owner_id = Column(Integer, nullable=False)
    owner_type = Column(String(255), nullable=False)
    owner_object = generic_relationship(owner_type, owner_id)
    user_id = Column(Integer, ForeignKey("ab_user.id"))
    is_primary = Column(Boolean)
```

### Dashboard (модификации)

```python
class Dashboard(AuditMixinNullable, ImportExportMixin, Model):
    """The dashboard object!"""

    __tablename__ = "dashboards"
    id = Column(Integer, primary_key=True)
    dashboard_title = Column(String(500))
    dashboard_title_ru = Column(String(500))  # dodo added 44120746
    position_json = Column(utils.MediumText())
    description = Column(Text)
    css = Column(utils.MediumText())
    certified_by = Column(Text)
    certification_details = Column(Text)
    json_metadata = Column(utils.MediumText())
    slug = Column(String(255), unique=True)
    slices: list[Slice] = relationship(
        Slice, secondary=dashboard_slices, backref="dashboards"
    )
    owners = relationship(
        security_manager.user_model,
        secondary=dashboard_user,
        passive_deletes=True,
    )
    _filter_sets = relationship("FilterSet", back_populates="dashboard")  # dodo added 44211751
```

## Примеры использования

### Получение информации о пользователе

```python
from superset.models.user_info import UserInfo
from superset import db

# Получение информации о пользователе по ID
user_id = 1
user_info = db.session.query(UserInfo).filter_by(user_id=user_id).one_or_none()

if user_info:
    # Получение роли пользователя в DODO
    dodo_role = user_info.dodo_role
    
    # Получение языка пользователя
    language = user_info.language
    
    # Получение страны пользователя
    country = user_info.country_name
    
    # Проверка завершения онбординга
    is_onboarding_finished = user_info.is_onboarding_finished
else:
    # Создание информации о пользователе
    user_info = UserInfo(
        user_id=user_id,
        language="ru",
        dodo_role="manager",
        country_name="Russia",
        is_onboarding_finished=False
    )
    db.session.add(user_info)
    db.session.commit()
```

### Работа с командами

```python
from superset.models.team import Team
from superset import db, security_manager

# Получение команды по ID
team_id = 1
team = db.session.query(Team).filter_by(id=team_id).one_or_none()

if team:
    # Получение участников команды
    participants = team.participants
    
    # Получение ролей команды
    roles = team.roles
    
    # Добавление пользователя в команду
    user = security_manager.find_user("user@example.com")
    if user and user not in participants:
        team.participants.append(user)
        db.session.commit()
else:
    # Создание новой команды
    team = Team(
        name="New Team",
        is_external=False,
        slug="new-team"
    )
    db.session.add(team)
    db.session.commit()
```

### Работа с наборами фильтров

```python
from superset.models.filter_set import FilterSet
from superset.models.dashboard import Dashboard
from superset import db

# Получение дашборда по ID
dashboard_id = 1
dashboard = db.session.query(Dashboard).filter_by(id=dashboard_id).one()

# Получение наборов фильтров дашборда
filter_sets = dashboard._filter_sets

# Создание нового набора фильтров
filter_set = FilterSet(
    name="New Filter Set",
    description="Description of the filter set",
    json_metadata='{"filters": {"1": {"column": "country", "operator": "==", "value": "Russia"}}}',
    dashboard_id=dashboard_id,
    owner_id=1,
    owner_type="user",
    user_id=1,
    is_primary=False
)
db.session.add(filter_set)
db.session.commit()
```

### Работа с локализованными дашбордами

```python
from superset.models.dashboard import Dashboard
from superset import db

# Получение дашборда по ID
dashboard_id = 1
dashboard = db.session.query(Dashboard).filter_by(id=dashboard_id).one()

# Получение заголовка дашборда на русском языке
title_ru = dashboard.dashboard_title_ru or dashboard.dashboard_title

# Обновление заголовка дашборда на русском языке
dashboard.dashboard_title_ru = "Новый заголовок дашборда"
db.session.commit()
```
