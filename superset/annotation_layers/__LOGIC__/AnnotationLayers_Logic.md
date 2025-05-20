# Документация по слоям аннотаций (Annotation Layers) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Стандартная функциональность](#стандартная-функциональность)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
5. [Техническая реализация](#техническая-реализация)
6. [API](#api)

## Введение

Модуль `annotation_layers` предоставляет функциональность для создания и управления аннотациями в Superset. Аннотации позволяют добавлять дополнительную информацию на графики и диаграммы, такую как важные события, периоды времени или пометки.

В DODO аннотации используются для отображения оповещений и важных событий на дашбордах, что позволяет аналитикам и пользователям быстро идентифицировать критические моменты в данных.

## Архитектура

Модуль состоит из следующих основных компонентов:

1. **Модели данных** (`models/annotations.py`):
   - `AnnotationLayer` - модель слоя аннотаций
   - `Annotation` - модель отдельной аннотации

2. **API** (`annotation_layers/api.py` и `annotation_layers/annotations/api.py`):
   - `AnnotationLayerRestApi` - REST API для работы со слоями аннотаций
   - `AnnotationRestApi` - REST API для работы с отдельными аннотациями

3. **Схемы** (`annotation_layers/schemas.py` и `annotation_layers/annotations/schemas.py`):
   - Схемы для валидации и сериализации данных

4. **Фильтры** (`annotation_layers/filters.py` и `annotation_layers/annotations/filters.py`):
   - Фильтры для поиска аннотаций и слоев аннотаций

5. **Команды** (в папке `commands/annotation_layer/`):
   - Команды для создания, обновления и удаления аннотаций и слоев аннотаций

## Стандартная функциональность

Стандартная функциональность модуля `annotation_layers` включает:

1. **Управление слоями аннотаций**:
   - Создание, чтение, обновление и удаление слоев аннотаций
   - Фильтрация и поиск слоев аннотаций

2. **Управление аннотациями**:
   - Создание, чтение, обновление и удаление аннотаций
   - Фильтрация и поиск аннотаций
   - Привязка аннотаций к слоям

3. **Отображение аннотаций на графиках**:
   - Отображение аннотаций на временных рядах
   - Отображение событий и интервалов

## DODO-специфичная функциональность

В DODO аннотации используются для создания системы оповещений и уведомлений. Основная DODO-специфичная функциональность связана с использованием аннотаций для отображения оповещений на дашбордах.

### Система оповещений на основе аннотаций

**Описание**: В DODO реализована система оповещений, которая использует аннотации с префиксом `[ALERT]` для отображения важных уведомлений на дашбордах.

**Реализация**:
- Утилиты для работы с аннотациями находятся в файле `superset-frontend/src/DodoExtensions/utils/annotationUtils.ts`
- Система фильтрует аннотации по префиксу `[ALERT]` и отображает их как оповещения

**Пример кода**:
```typescript
// DODO created 44611022
const ALERT_PREFIX = '[ALERT]';

const handleAnnotationLayersRequest = async () => {
  const annotationsResponse = await getAnnotationLayersData();

  if (annotationsResponse.loaded && annotationsResponse.data) {
    const filteredAnnotationLayers = annotationsResponse.data.filter(
      (layer: AnnotationLayer) => layer.name.includes(ALERT_PREFIX),
    );

    // Дальнейшая обработка слоев аннотаций с префиксом [ALERT]
    // ...
  }

  return null;
};
```

**Бизнес-логика**:
- Аналитики могут создавать оповещения, добавляя аннотации с префиксом `[ALERT]`
- Оповещения автоматически отображаются на соответствующих дашбордах
- Это позволяет быстро информировать пользователей о важных событиях или аномалиях в данных

### Интеграция с фронтендом

Для отображения оповещений на фронтенде используются следующие функции:

1. `loadAnnotations` - загружает все аннотации с префиксом `[ALERT]`
2. `handleAnnotationLayersRequest` - получает слои аннотаций с префиксом `[ALERT]`
3. `handleAnnotationsRequest` - получает отдельные аннотации из выбранных слоев

## Техническая реализация

### Модели данных

**AnnotationLayer**:
```python
class AnnotationLayer(Model, AuditMixinNullable):
    """A logical namespace for a set of annotations"""

    __tablename__ = "annotation_layer"
    id = Column(Integer, primary_key=True)
    name = Column(String(250))
    descr = Column(Text)
```

**Annotation**:
```python
class Annotation(Model, AuditMixinNullable):
    """Annotation model"""

    __tablename__ = "annotation"
    id = Column(Integer, primary_key=True)
    layer_id = Column(Integer, ForeignKey("annotation_layer.id"), nullable=False)
    short_descr = Column(String(500))
    long_descr = Column(Text)
    start_dttm = Column(DateTime)
    end_dttm = Column(DateTime)
    json_metadata = Column(Text)

    layer = relationship("AnnotationLayer", foreign_keys=[layer_id])
```

### API для работы с аннотациями

API для работы с аннотациями предоставляет стандартные CRUD-операции:

1. **Получение списка аннотаций**:
   ```
   GET /api/v1/annotation_layer/{layer_id}/annotation/
   ```

2. **Получение отдельной аннотации**:
   ```
   GET /api/v1/annotation_layer/{layer_id}/annotation/{annotation_id}
   ```

3. **Создание аннотации**:
   ```
   POST /api/v1/annotation_layer/{layer_id}/annotation/
   ```

4. **Обновление аннотации**:
   ```
   PUT /api/v1/annotation_layer/{layer_id}/annotation/{annotation_id}
   ```

5. **Удаление аннотации**:
   ```
   DELETE /api/v1/annotation_layer/{layer_id}/annotation/{annotation_id}
   ```

## API

### API для работы со слоями аннотаций

```
GET /api/v1/annotation_layer/
POST /api/v1/annotation_layer/
PUT /api/v1/annotation_layer/{id}
DELETE /api/v1/annotation_layer/{id}
```

### API для работы с аннотациями

```
GET /api/v1/annotation_layer/{layer_id}/annotation/
POST /api/v1/annotation_layer/{layer_id}/annotation/
PUT /api/v1/annotation_layer/{layer_id}/annotation/{id}
DELETE /api/v1/annotation_layer/{layer_id}/annotation/{id}
```

### Пример создания оповещения через API

```json
POST /api/v1/annotation_layer/{layer_id}/annotation/
{
  "short_descr": "[ALERT] Важное оповещение",
  "long_descr": "Подробное описание оповещения",
  "start_dttm": "2023-01-01T00:00:00",
  "end_dttm": "2023-01-02T00:00:00"
}
```
