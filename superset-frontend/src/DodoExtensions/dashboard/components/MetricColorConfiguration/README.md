# Компонент MetricColorConfiguration - Финальная спецификация

## Обзор

Этот документ описывает финальную спецификацию компонента MetricColorConfiguration, который позволяет пользователям настраивать цвета метрик на дашбордах. Спецификация основана на прототипе, разработанном и согласованном с пользователями.

## Основные функции

1. **Просмотр и редактирование цветов метрик** в удобном карточном интерфейсе
2. **Поиск метрик** по названию
3. **Пагинация** для работы с большим количеством метрик
4. **Индикация измененных метрик** для лучшего понимания внесенных изменений
5. **Контекстная информация** о том, в каких графиках используется каждая метрика
6. **Возможность удаления настроек цвета** для отдельных метрик
7. **Отмена изменений** для метрик, цвета которых были изменены

## Интерфейс пользователя

### Макет интерфейса

```
+------------------------------------------+
| Настройка цветов метрик [2 изменения] [X]|
+------------------------------------------+
| [Поиск метрик...]                        |
+------------------------------------------+
|                                          |
| +----------------+  +----------------+   |
| | Метрика 1      |  | Метрика 2      |   |
| | [Изменено]     |  |                |   |
| |                |  |                |   |
| | Текущий цвет:  |  | Текущий цвет:  |   |
| | [Цвет] #HEX    |  | [?] Не назначен|   |
| |                |  |                |   |
| | Используется в:|  | Используется в:|   |
| | [График 1]     |  | [График 2]     |   |
| | [График 2]     |  | [График 3]     |   |
| |                |  |                |   |
| | [Отменить]     |  | [Удалить]      |   |
| | [Удалить]      |  |                |   |
| +----------------+  +----------------+   |
|                                          |
| +----------------+  +----------------+   |
| | Метрика 3      |  | Метрика 4      |   |
| |                |  | [Изменено]     |   |
| |                |  |                |   |
| | Текущий цвет:  |  | Текущий цвет:  |   |
| | [Цвет] #HEX    |  | [Цвет] #HEX    |   |
| |                |  |                |   |
| | Используется в:|  | Используется в:|   |
| | [График 1]     |  | [График 4]     |   |
| | [График 3]     |  | [График 5]     |   |
| |                |  |                |   |
| | [Удалить]      |  | [Отменить]     |   |
| |                |  | [Удалить]      |   |
| +----------------+  +----------------+   |
|                                          |
| [<< 1 2 3 >>]                           |
+------------------------------------------+
| [Отмена]                      [Сохранить]|
+------------------------------------------+
```

### Карточка метрики

Карточка метрики имеет следующую структуру:

1. **Заголовок**:
   - Название метрики
   - Индикатор "Изменено" (если цвет метрики был изменен)

2. **Содержимое**:
   - Текущий цвет (цветовой индикатор и HEX-код)
   - Список графиков, в которых используется метрика

3. **Футер**:
   - Кнопка "Отменить изменение" (только для измененных метрик)
   - Кнопка "Удалить настройку"

## Состояния метрик

### 1. Метрика с назначенным цветом (не изменена)
- Отображается цветовой индикатор и HEX-код
- В футере только кнопка "Удалить настройку"

### 2. Метрика с измененным цветом
- Отображается цветовой индикатор и HEX-код
- В заголовке присутствует индикатор "Изменено"
- В футере кнопки "Отменить изменение" и "Удалить настройку"

### 3. Метрика без назначенного цвета
- Вместо цветового индикатора отображается серый квадрат с вопросительным знаком
- Вместо HEX-кода отображается текст "Не назначен"
- В футере только кнопка "Удалить настройку"

## Взаимодействие с пользователем

### Изменение цвета
1. Пользователь кликает на цветовой индикатор
2. Появляется цветовой пикер
3. Пользователь выбирает новый цвет
4. Метрика получает индикатор "Изменено"
5. Появляется кнопка "Отменить изменение"

### Отмена изменения
1. Пользователь нажимает кнопку "Отменить изменение"
2. Цвет метрики возвращается к исходному значению
3. Индикатор "Изменено" исчезает
4. Кнопка "Отменить изменение" исчезает

### Удаление настройки
1. Пользователь нажимает кнопку "Удалить настройку"
2. Настройка цвета для метрики удаляется
3. Метрика переходит в состояние "без назначенного цвета"

### Поиск метрик
1. Пользователь вводит текст в поле поиска
2. Отображаются только метрики, названия которых содержат введенный текст

### Пагинация
1. Метрики разбиты на страницы (по 8-12 метрик на странице)
2. Пользователь может переключаться между страницами с помощью кнопок пагинации
3. Пагинация всегда отображается внизу области с метриками

## Компоненты React

### 1. MetricColorConfiguration
Основной компонент, который содержит всю логику и состояние.

```jsx
const MetricColorConfiguration = ({
  labelColors,
  onChange,
  onClose,
  dashboardInfo,
  charts
}) => {
  // Состояние
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [newLabelColors, setNewLabelColors] = useState({});
  const [deletedLabels, setDeletedLabels] = useState({});

  // Логика
  // ...

  return (
    <Modal>
      <Header />
      <SearchBar />
      <MetricsContainer>
        <MetricCards />
        <Pagination />
      </MetricsContainer>
      <Footer />
    </Modal>
  );
};
```

### 2. MetricCard
Компонент для отображения карточки метрики.

```jsx
const MetricCard = ({
  metric,
  isAltered,
  onColorChange,
  onResetColor,
  onDeleteColor,
  charts
}) => {
  // Логика
  // ...

  return (
    <Card className={isAltered ? 'altered' : ''}>
      <CardHeader>
        <MetricName>{metric.name}</MetricName>
        {isAltered && <ChangeIndicator>Изменено</ChangeIndicator>}
      </CardHeader>

      <CardContent>
        <ColorRow>
          <ColorLabel>Текущий цвет:</ColorLabel>
          <ColorSwatchContainer>
            {hasColor ? (
              <ColorSwatch color={color} onClick={handleColorClick} />
            ) : (
              <NoColorSwatch onClick={handleColorClick}>?</NoColorSwatch>
            )}
            <ColorValue>{hasColor ? color : 'Не назначен'}</ColorValue>
          </ColorSwatchContainer>
        </ColorRow>

        <UsageRow>
          <UsageLabel>Используется в:</UsageLabel>
          {charts.map(chart => (
            <ChartLink key={chart.id} href={`#/chart/${chart.id}`}>
              {chart.name}
            </ChartLink>
          ))}
        </UsageRow>
      </CardContent>

      <CardFooter>
        <FooterActions>
          {isAltered && (
            <ActionButton onClick={onResetColor}>
              Отменить изменение
            </ActionButton>
          )}
          <ActionButton onClick={onDeleteColor}>
            Удалить настройку
          </ActionButton>
        </FooterActions>
      </CardFooter>
    </Card>
  );
};
```

### 3. Pagination
Компонент для отображения пагинации.

```jsx
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  // Логика
  // ...

  return (
    <PaginationContainer>
      <PaginationButton
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &laquo;
      </PaginationButton>

      {pageNumbers.map(number => (
        <PaginationButton
          key={number}
          active={currentPage === number}
          onClick={() => onPageChange(number)}
        >
          {number}
        </PaginationButton>
      ))}

      <PaginationButton
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        &raquo;
      </PaginationButton>
    </PaginationContainer>
  );
};
```

## Стили

Компонент использует styled-components для стилизации. Основные стили:

```jsx
// Контейнер для метрик
const MetricsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

// Сетка карточек
const MetricCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  flex: 1;
`;

// Карточка метрики
const Card = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.2s ease;
  height: 100%;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &.altered .card-header {
    position: relative;
  }
`;

// Индикатор изменения
const ChangeIndicator = styled.span`
  display: inline-block;
  font-size: 11px;
  background-color: #20a7c9;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
  font-weight: normal;
`;

// Пагинация
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
  gap: 4px;
  border-top: 1px solid #e0e0e0;
  margin-top: 24px;
`;
```

## Интеграция с существующим кодом

Компонент интегрируется с существующим кодом следующим образом:

1. Получает текущие настройки цветов из `dashboardInfo.metadata.label_colors`
2. Получает информацию о графиках из `charts`
3. При сохранении вызывает действие Redux `saveLabelColorsSettings`
4. Использует существующий компонент `ColorPickerControlDodo` для выбора цвета

## Локализация

Компонент поддерживает локализацию с использованием функции `t` из `@superset-ui/core`. Все текстовые строки должны быть обернуты в эту функцию:

```jsx
<ActionButton onClick={onResetColor}>
  {t('Отменить изменение')}
</ActionButton>
```

## Производительность

Для обеспечения хорошей производительности:

1. Используется пагинация для отображения ограниченного количества метрик
2. Применяется дебаунсинг для поиска
3. Используется мемоизация для вычисляемых значений
4. Применяется виртуализация для списков с большим количеством элементов

## Тестирование

Компонент должен быть покрыт следующими типами тестов:

1. **Юнит-тесты** для проверки логики компонента
2. **Интеграционные тесты** для проверки взаимодействия с Redux
3. **Снэпшот-тесты** для проверки рендеринга компонента
4. **E2E-тесты** для проверки пользовательских сценариев
