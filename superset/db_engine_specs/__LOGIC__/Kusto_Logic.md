# Документация по спецификации движка Kusto в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Спецификации движков](#спецификации-движков)
   - [KustoSqlEngineSpec](#kustosqlenginespec)
   - [KustoKqlEngineSpec](#kustokqlenginespec)
4. [Особенности использования в DODO](#особенности-использования-в-dodo)
5. [Техническая реализация](#техническая-реализация)
6. [Примеры использования](#примеры-использования)

## Введение

Azure Data Explorer (Kusto) - это быстрый и масштабируемый сервис исследования данных для анализа больших объемов данных в реальном времени. В DODO Kusto используется как основной инструмент для аналитики и обработки больших объемов данных.

Superset поддерживает два режима работы с Kusto:
1. **KustoSQL** - использует SQL-подобный синтаксис для запросов
2. **KustoKQL** - использует собственный язык запросов Kusto (Kusto Query Language)

В DODO в настоящее время используется преимущественно KustoSQL, но есть планы по внедрению KustoKQL, так как он предоставляет более широкие возможности для анализа данных и лучше оптимизирован для работы с большими объемами данных.

## Архитектура

Модуль `db_engine_specs/kusto.py` содержит две основные спецификации движков:

1. **KustoSqlEngineSpec** - спецификация для работы с Kusto через SQL-подобный синтаксис
2. **KustoKqlEngineSpec** - спецификация для работы с Kusto через собственный язык запросов KQL

Обе спецификации наследуются от базового класса `BaseEngineSpec` и реализуют специфичные для Kusto методы и свойства.

## Спецификации движков

### KustoSqlEngineSpec

Спецификация для работы с Kusto через SQL-подобный синтаксис:

- **Идентификатор движка**: `kustosql`
- **Имя движка**: `KustoSQL`
- **Метод ограничения**: `LimitMethod.WRAP_SQL` (обертывание SQL-запроса)
- **Поддержка соединений**: Да
- **Поддержка подзапросов**: Да
- **Поддержка комментариев SQL**: Нет

Основные особенности:
- Поддержка временных зерен (time grains) для агрегации данных по времени
- Преобразование типов данных даты и времени
- Проверка запросов на "только чтение"

### KustoKqlEngineSpec

Спецификация для работы с Kusto через собственный язык запросов KQL:

- **Идентификатор движка**: `kustokql`
- **Имя движка**: `KustoKQL`
- **Метод ограничения**: `LimitMethod.WRAP_SQL` (обертывание SQL-запроса)
- **Поддержка соединений**: Да
- **Поддержка подзапросов**: Да
- **Поддержка комментариев SQL**: Нет
- **Выполнение нескольких операторов как одного**: Да

Основные особенности:
- Специфичные для KQL временные зерна (time grains)
- Преобразование типов данных даты и времени в формат KQL
- Проверка запросов на "только чтение"
- Поддержка команд `.show`

## Особенности использования в DODO

В DODO Kusto используется как основной инструмент для аналитики и обработки больших объемов данных. Основные особенности использования:

1. **Текущее использование KustoSQL и планы по внедрению KQL**: В DODO в настоящее время используется преимущественно KustoSQL, но есть планы по внедрению KustoKQL, так как он предоставляет более широкие возможности для анализа данных и лучше оптимизирован для работы с большими объемами данных.

2. **Интеграция с другими системами**: Kusto интегрирован с другими системами DODO для обеспечения единого источника данных для аналитики.

3. **Оптимизация запросов**: В DODO особое внимание уделяется оптимизации запросов к Kusto для обеспечения высокой производительности при работе с большими объемами данных.

4. **Безопасность**: Реализованы механизмы контроля доступа к данным в Kusto для обеспечения безопасности и конфиденциальности данных.

## Техническая реализация

### Временные зерна (Time Grains)

#### KustoSQL

```python
_time_grain_expressions = {
    None: "{col}",
    TimeGrain.SECOND: "DATEADD(second, \
        'DATEDIFF(second, 2000-01-01', {col}), '2000-01-01')",
    TimeGrain.MINUTE: "DATEADD(minute, DATEDIFF(minute, 0, {col}), 0)",
    TimeGrain.FIVE_MINUTES: "DATEADD(minute, DATEDIFF(minute, 0, {col}) / 5 * 5, 0)",
    TimeGrain.TEN_MINUTES: "DATEADD(minute, \
        DATEDIFF(minute, 0, {col}) / 10 * 10, 0)",
    TimeGrain.FIFTEEN_MINUTES: "DATEADD(minute, \
        DATEDIFF(minute, 0, {col}) / 15 * 15, 0)",
    TimeGrain.HALF_HOUR: "DATEADD(minute, DATEDIFF(minute, 0, {col}) / 30 * 30, 0)",
    TimeGrain.HOUR: "DATEADD(hour, DATEDIFF(hour, 0, {col}), 0)",
    TimeGrain.DAY: "DATEADD(day, DATEDIFF(day, 0, {col}), 0)",
    TimeGrain.WEEK: "DATEADD(day, -1, DATEADD(week, DATEDIFF(week, 0, {col}), 0))",
    TimeGrain.MONTH: "DATEADD(month, DATEDIFF(month, 0, {col}), 0)",
    TimeGrain.QUARTER: "DATEADD(quarter, DATEDIFF(quarter, 0, {col}), 0)",
    TimeGrain.YEAR: "DATEADD(year, DATEDIFF(year, 0, {col}), 0)",
    TimeGrain.WEEK_STARTING_SUNDAY: "DATEADD(day, -1,"
    " DATEADD(week, DATEDIFF(week, 0, {col}), 0))",
    TimeGrain.WEEK_STARTING_MONDAY: "DATEADD(week,"
    " DATEDIFF(week, 0, DATEADD(day, -1, {col})), 0)",
}
```

#### KustoKQL

```python
_time_grain_expressions = {
    None: "{col}",
    TimeGrain.SECOND: "{col}/ time(1s)",
    TimeGrain.MINUTE: "{col}/ time(1min)",
    TimeGrain.HOUR: "{col}/ time(1h)",
    TimeGrain.DAY: "{col}/ time(1d)",
    TimeGrain.MONTH: "datetime_diff('month', CreateDate, \
        datetime(0001-01-01 00:00:00))+1",
    TimeGrain.YEAR: "datetime_diff('year', CreateDate, \
        datetime(0001-01-01 00:00:00))+1",
}
```

### Преобразование типов данных даты и времени

#### KustoSQL

```python
@classmethod
def convert_dttm(
    cls, target_type: str, dttm: datetime, db_extra: Optional[dict[str, Any]] = None
) -> Optional[str]:
    sqla_type = cls.get_sqla_column_type(target_type)

    if isinstance(sqla_type, types.Date):
        return f"CONVERT(DATE, '{dttm.date().isoformat()}', 23)"
    if isinstance(sqla_type, types.TIMESTAMP):
        datetime_formatted = dttm.isoformat(sep=" ", timespec="seconds")
        return f"""CONVERT(TIMESTAMP, '{datetime_formatted}', 20)"""
    if isinstance(sqla_type, SMALLDATETIME):
        datetime_formatted = dttm.isoformat(sep=" ", timespec="seconds")
        return f"""CONVERT(SMALLDATETIME, '{datetime_formatted}', 20)"""
    if isinstance(sqla_type, types.DateTime):
        datetime_formatted = dttm.isoformat(timespec="milliseconds")
        return f"""CONVERT(DATETIME, '{datetime_formatted}', 126)"""
    return None
```

#### KustoKQL

```python
@classmethod
def convert_dttm(
    cls, target_type: str, dttm: datetime, db_extra: Optional[dict[str, Any]] = None
) -> Optional[str]:
    sqla_type = cls.get_sqla_column_type(target_type)

    if isinstance(sqla_type, types.Date):
        return f"""datetime({dttm.date().isoformat()})"""
    if isinstance(sqla_type, types.DateTime):
        return f"""datetime({dttm.isoformat(timespec="microseconds")})"""

    return None
```

### Проверка запросов на "только чтение"

#### KustoSQL

```python
@classmethod
def is_readonly_query(cls, parsed_query: ParsedQuery) -> bool:
    """Pessimistic readonly, 100% sure statement won't mutate anything"""
    return parsed_query.sql.lower().startswith("select")
```

#### KustoKQL

```python
@classmethod
def is_readonly_query(cls, parsed_query: ParsedQuery) -> bool:
    """
    Pessimistic readonly, 100% sure statement won't mutate anything.
    """
    return KustoKqlEngineSpec.is_select_query(
        parsed_query
    ) or parsed_query.sql.startswith(".show")

@classmethod
def is_select_query(cls, parsed_query: ParsedQuery) -> bool:
    return not parsed_query.sql.startswith(".")
```

### Обработка исключений

```python
@classmethod
def get_dbapi_exception_mapping(cls) -> dict[type[Exception], type[Exception]]:
    # pylint: disable=import-outside-toplevel,import-error
    import sqlalchemy_kusto.errors as kusto_exceptions

    return {
        kusto_exceptions.DatabaseError: SupersetDBAPIDatabaseError,
        kusto_exceptions.OperationalError: SupersetDBAPIOperationalError,
        kusto_exceptions.ProgrammingError: SupersetDBAPIProgrammingError,
    }
```

## Примеры использования

### Пример запроса KQL

```kql
StormEvents
| where StartTime >= datetime(2007-11-01) and StartTime < datetime(2007-12-01)
| where State == "FLORIDA"
| count
```

### Пример запроса KustoSQL

```sql
SELECT COUNT(*)
FROM StormEvents
WHERE StartTime >= CONVERT(DATETIME, '2007-11-01T00:00:00.000', 126)
  AND StartTime < CONVERT(DATETIME, '2007-12-01T00:00:00.000', 126)
  AND State = 'FLORIDA'
```

### Пример использования временных зерен

#### KQL

```kql
StormEvents
| where StartTime >= datetime(2007-01-01) and StartTime < datetime(2008-01-01)
| summarize EventCount=count() by bin(StartTime, 1d)
| render timechart
```

#### SQL

```sql
SELECT
  DATEADD(day, DATEDIFF(day, 0, StartTime), 0) as StartTime,
  COUNT(*) as EventCount
FROM StormEvents
WHERE StartTime >= CONVERT(DATETIME, '2007-01-01T00:00:00.000', 126)
  AND StartTime < CONVERT(DATETIME, '2008-01-01T00:00:00.000', 126)
GROUP BY DATEADD(day, DATEDIFF(day, 0, StartTime), 0)
ORDER BY StartTime
```

### Пример использования в DODO

В DODO Kusto используется для анализа данных о продажах, логистике, клиентах и других бизнес-процессах. Типичные сценарии использования:

1. **Анализ продаж (KustoSQL)**:
   ```sql
   SELECT
     Region,
     SUM(Amount) as TotalSales
   FROM Sales
   WHERE Date >= CONVERT(DATETIME, '2023-01-01T00:00:00.000', 126)
     AND Date < CONVERT(DATETIME, '2023-02-01T00:00:00.000', 126)
   GROUP BY Region
   ORDER BY TotalSales DESC
   ```

2. **Мониторинг логистики (KustoSQL)**:
   ```sql
   SELECT
     Region,
     AVG(DeliveryTime) as AvgDeliveryTime,
     COUNT(*) as CountDeliveries
   FROM Deliveries
   WHERE DeliveryDate >= CONVERT(DATETIME, '2023-01-01T00:00:00.000', 126)
     AND DeliveryDate < CONVERT(DATETIME, '2023-02-01T00:00:00.000', 126)
   GROUP BY Region
   ORDER BY AvgDeliveryTime DESC
   ```

3. **Анализ клиентов (KustoSQL)**:
   ```sql
   SELECT
     DATEADD(day, DATEDIFF(day, 0, RegisterDate), 0) as RegisterDay,
     COUNT(*) as NewCustomers
   FROM Customers
   WHERE RegisterDate >= CONVERT(DATETIME, '2023-01-01T00:00:00.000', 126)
   GROUP BY DATEADD(day, DATEDIFF(day, 0, RegisterDate), 0)
   ORDER BY RegisterDay
   ```

4. **Примеры запросов в KQL (планируемые к внедрению)**:
   ```kql
   Sales
   | where Date >= datetime(2023-01-01) and Date < datetime(2023-02-01)
   | summarize TotalSales=sum(Amount) by Region
   | order by TotalSales desc
   ```
