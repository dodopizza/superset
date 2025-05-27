# Документация по встроенным дашбордам (Embedded Dashboard) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Стандартная функциональность](#стандартная-функциональность)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
5. [Техническая реализация](#техническая-реализация)
6. [Примеры использования](#примеры-использования)

## Введение

Модуль `embedded_dashboard` содержит модели данных для встраивания дашбордов Superset в другие веб-приложения. Эта функциональность позволяет использовать дашборды Superset в качестве встроенных элементов в других приложениях, включая DODO IS.

В DODO этот модуль используется для интеграции дашбордов Superset в интерфейс DODO IS, что позволяет пользователям просматривать аналитические данные непосредственно в интерфейсе системы управления.

## Архитектура

Модуль `embedded_dashboard` содержит модель данных `EmbeddedDashboard`, которая представляет конфигурацию встраивания для дашборда:

1. **Модель данных** (`models.py`):
   - `EmbeddedDashboard` - модель для хранения конфигурации встраивания дашборда
   - Связана с моделью `Dashboard` через отношение один-ко-многим

2. **Миграции**:
   - Миграция для создания таблицы `embedded_dashboards`
   - Добавление связи с таблицей `dashboards`

3. **Исключения**:
   - `EmbeddedDashboardNotFoundError` - исключение, возникающее при отсутствии встроенного дашборда
   - `EmbeddedDashboardAccessDeniedError` - исключение, возникающее при отсутствии доступа к встроенному дашборду

## Стандартная функциональность

Стандартная функциональность модуля `embedded_dashboard` включает:

1. **Хранение конфигурации встраивания**:
   - Хранение UUID для идентификации встроенного дашборда
   - Хранение списка разрешенных доменов для встраивания

2. **Связь с дашбордами**:
   - Связь с моделью `Dashboard` для определения, какой дашборд встраивается
   - Поддержка отношения один-ко-многим (один дашборд может иметь несколько конфигураций встраивания)

3. **Управление доступом**:
   - Ограничение доступа к встроенным дашбордам по доменам
   - Проверка прав доступа к встроенным дашбордам

## DODO-специфичная функциональность

В результате анализа кода **не обнаружено DODO-специфичных изменений или расширений** в модуле `embedded_dashboard`. Весь код в этом модуле является стандартным для Superset.

Однако, в DODO модуль `embedded_dashboard` используется для интеграции дашбордов Superset в интерфейс DODO IS. Основные аспекты использования:

1. **Интеграция с DODO IS**:
   - Встраивание дашбордов Superset в интерфейс DODO IS
   - Использование единой системы аутентификации

2. **Локализация интерфейса**:
   - Поддержка русского языка в интерфейсе встроенных дашбордов
   - Локализованные сообщения и подсказки

3. **Брендирование**:
   - Использование стилей и цветовой схемы DODO
   - Интеграция с общим дизайном DODO IS

Эти аспекты реализованы на уровне фронтенда в директории `superset-frontend/src/Superstructure` и не требуют изменений в самом модуле `embedded_dashboard`.

## Техническая реализация

### Модель EmbeddedDashboard

Модель для хранения конфигурации встраивания дашборда:

```python
class EmbeddedDashboard(Model, AuditMixinNullable):
    """
    A configuration of embedding for a dashboard.
    Currently, the only embeddable resource is the Dashboard.
    If we add new embeddable resource types, this model should probably be renamed.

    References the dashboard, and contains a config for embedding that dashboard.

    This data model allows multiple configurations for a given dashboard,
    but at this time the API only allows setting one.
    """

    __tablename__ = "embedded_dashboards"

    uuid = Column(UUIDType(binary=True), default=uuid.uuid4, primary_key=True)
    allow_domain_list = Column(Text)  # reference the `allowed_domains` property instead
    dashboard_id = Column(
        Integer,
        ForeignKey("dashboards.id", ondelete="CASCADE"),
        nullable=False,
    )
    dashboard = relationship(
        "Dashboard",
        back_populates="embedded",
        foreign_keys=[dashboard_id],
    )

    @property
    def allowed_domains(self) -> list[str]:
        """
        A list of domains which are allowed to embed the dashboard.
        An empty list means any domain can embed.
        """
        return self.allow_domain_list.split(",") if self.allow_domain_list else []
```

### Миграция для создания таблицы embedded_dashboards

```python
def upgrade():
    op.create_table(
        "embedded_dashboards",
        sa.Column("created_on", sa.DateTime(), nullable=True),
        sa.Column("changed_on", sa.DateTime(), nullable=True),
        sa.Column("allow_domain_list", sa.Text(), nullable=True),
        sa.Column("uuid", UUIDType(binary=True), default=uuid4),
        sa.Column(
            "dashboard_id", sa.Integer(), sa.ForeignKey("dashboards.id"), nullable=False
        ),
        sa.Column("changed_by_fk", sa.Integer(), nullable=True),
        sa.Column("created_by_fk", sa.Integer(), nullable=True),
    )


def downgrade():
    op.drop_table("embedded_dashboards")
```

### Исключения для встроенных дашбордов

```python
class EmbeddedDashboardNotFoundError(ObjectNotFoundError):
    def __init__(
        self,
        embedded_dashboard_uuid: Optional[str] = None,
        exception: Optional[Exception] = None,
    ) -> None:
        super().__init__("EmbeddedDashboard", embedded_dashboard_uuid, exception)


class EmbeddedDashboardAccessDeniedError(ForbiddenError):
    message = _("You don't have access to this embedded dashboard config.")
```

### Связь с моделью Dashboard

В модели `Dashboard` добавлено отношение к модели `EmbeddedDashboard`:

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
    roles = relationship(
        security_manager.role_model,
        secondary=dashboard_roles,
        passive_deletes=True,
    )
    published = Column(Boolean, default=False)
    is_managed_externally = Column(Boolean, nullable=False, default=False)
    external_url = Column(Text, nullable=True)
    embedded = relationship(
        "EmbeddedDashboard",
        back_populates="dashboard",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
```

## Примеры использования

### Создание конфигурации встраивания для дашборда

```python
from superset.daos.dashboard import EmbeddedDashboardDAO
from superset.models.dashboard import Dashboard

# Получение дашборда
dashboard = Dashboard.get_by_id_or_slug(1)

# Настройка встраивания
embedded = EmbeddedDashboardDAO.upsert(
    dashboard=dashboard,
    allowed_domains=["https://dodois.io", "https://dodo.dev"]
)

print(f"Embedded dashboard UUID: {embedded.uuid}")
```

### Получение конфигурации встраивания для дашборда

```python
from superset.daos.dashboard import EmbeddedDashboardDAO

# Получение встроенного дашборда по UUID
embedded = EmbeddedDashboardDAO.find_by_id("uuid-string")

# Получение списка разрешенных доменов
allowed_domains = embedded.allowed_domains
print(f"Allowed domains: {', '.join(allowed_domains)}")

# Получение связанного дашборда
dashboard = embedded.dashboard
print(f"Dashboard title: {dashboard.dashboard_title}")
```

### Проверка доступа к встроенному дашборду

```python
from flask import request
from superset.utils.urls import same_origin

# Проверка доступа к встроенному дашборду
is_referrer_allowed = not embedded.allowed_domains
for domain in embedded.allowed_domains:
    if same_origin(request.referrer, domain):
        is_referrer_allowed = True
        break

if not is_referrer_allowed:
    # Доступ запрещен
    abort(403)
```

### Встраивание дашборда на фронтенде

```typescript
import { embedDashboard } from '@superset-embedded-sdk';

// Функция для получения гостевого токена от сервера
async function fetchGuestToken() {
  const response = await fetch('/api/superset/guest-token');
  const data = await response.json();
  return data.token;
}

// Встраивание дашборда
const dashboard = await embedDashboard({
  id: 'dashboard-uuid',
  supersetDomain: 'https://analytics.dodois.io',
  mountPoint: document.getElementById('dashboard-container'),
  fetchGuestToken,
  dashboardUiConfig: {
    hideTitle: true,
    hideChartControls: true,
    hideTab: false,
  },
});
```
