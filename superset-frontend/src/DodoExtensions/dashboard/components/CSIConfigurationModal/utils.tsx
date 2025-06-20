/* eslint-disable theme-colors/no-literal-colors */
import { t } from '@superset-ui/core';
import { Tooltip } from 'src/components/Tooltip';

export const areArraysEqual = (arr1: string[], arr2: string[]): boolean => {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  if (set1.size !== set2.size) return false;

  for (const item of set1) {
    if (!set2.has(item)) return false;
  }

  return true;
};

export interface Feedback {
  id: string;
  date: string;
  rating: number;
  comment: string;
  is_anonymous: boolean;
  is_plugin: boolean;
}

export const mockedFeedbackData: Feedback[] = [
  {
    id: '1',
    date: '2025-01-15',
    rating: 5,
    comment: 'Отличный дашборд, очень информативный',
    is_anonymous: false,
    is_plugin: false,
  },
  {
    id: '2',
    date: '2025-01-14',
    rating: 4,
    comment: 'Хорошо, но можно улучшить производительность',
    is_anonymous: true,
    is_plugin: true,
  },
  {
    id: '3',
    date: '2025-01-13',
    rating: 3,
    comment: 'Средне, нужно больше фильтров',
    is_anonymous: false,
    is_plugin: false,
  },
  {
    id: '42',
    date: '2025-01-10',
    rating: 4.5,
    comment: 'Превосходно!',
    is_anonymous: true,
    is_plugin: true,
  },
  {
    id: '4',
    date: '2025-01-12',
    rating: 5,
    comment: 'Превосходно! Все данные на месте',
    is_anonymous: true,
    is_plugin: true,
  },
  {
    id: '5',
    date: '2025-01-11',
    rating: 2,
    comment: 'Медленно загружается, нужна оптимизация',
    is_anonymous: false,
    is_plugin: false,
  },

  // Февраль 2024
  {
    id: '21',
    date: '2025-02-05',
    rating: 4,
    comment: 'Интерфейс удобный, но не хватает тем',
    is_anonymous: true,
    is_plugin: true,
  },
  {
    id: '22',
    date: '2025-02-07',
    rating: 3.5,
    comment: 'Нормально, но есть баги',
    is_anonymous: false,
    is_plugin: false,
  },
  {
    id: '23',
    date: '2025-02-10',
    rating: 5,
    comment: 'Люблю этот дашборд!',
    is_anonymous: true,
    is_plugin: true,
  },
  {
    id: '24',
    date: '2025-02-12',
    rating: 2.5,
    comment: 'Возможно стоит переписать с нуля',
    is_anonymous: false,
    is_plugin: false,
  },
  {
    id: '25',
    date: '2025-02-14',
    rating: 4,
    comment: 'Производительность лучше, чем раньше',
    is_anonymous: true,
    is_plugin: true,
  },

  // Март 2024
  {
    id: '31',
    date: '2025-03-01',
    rating: 3,
    comment: 'Нужно доработать фильтрацию',
    is_anonymous: false,
    is_plugin: false,
  },
  {
    id: '32',
    date: '2025-03-03',
    rating: 5,
    comment: 'Очень доволен обновлениями',
    is_anonymous: true,
    is_plugin: true,
  },
  {
    id: '33',
    date: '2025-03-06',
    rating: 4.5,
    comment: 'Почти идеально',
    is_anonymous: false,
    is_plugin: false,
  },
  {
    id: '34',
    date: '2025-03-08',
    rating: 2,
    comment: 'Не работает на мобильных устройствах',
    is_anonymous: true,
    is_plugin: true,
  },
  {
    id: '35',
    date: '2025-03-10',
    rating: 4,
    comment: 'Хороший функционал, но медленный рендер',
    is_anonymous: false,
    is_plugin: false,
  },
  {
    id: '36',
    date: '2025-05-15',
    rating: 4,
    comment: 'Хороший функционал, но медленный рендер',
    is_anonymous: false,
    is_plugin: false,
  },
  {
    id: '37',
    date: '2025-06-15',
    rating: 4,
    comment: 'Хороший функционал, но медленный рендер',
    is_anonymous: false,
    is_plugin: false,
  },
  {
    id: '371',
    date: '2025-06-15',
    rating: 2.5,
    comment: 'Ну такое себе',
    is_anonymous: false,
    is_plugin: false,
  },
  {
    id: '371',
    date: '2025-06-18',
    rating: 3,
    comment: 'Давайте лучше',
    is_anonymous: false,
    is_plugin: false,
  },
  {
    id: '38',
    date: '2025-07-15',
    rating: 4,
    comment: 'Хороший функционал, но медленный рендер',
    is_anonymous: false,
    is_plugin: false,
  },
  {
    id: '39',
    date: '2025-08-15',
    rating: 4,
    comment: 'Хороший функционал, но медленный рендер',
    is_anonymous: false,
    is_plugin: false,
  },
  {
    id: '40',
    date: '2025-09-15',
    rating: 4,
    comment: 'Хороший функционал, но медленный рендер',
    is_anonymous: false,
    is_plugin: false,
  },
];

export const getTableColumns = () => [
  {
    title: t('Date'),
    dataIndex: 'date',
    key: 'date',
    width: 100,
    sorter: (a: Feedback, b: Feedback) =>
      new Date(a.date).getTime() - new Date(b.date).getTime(),
  },
  {
    title: t('Rating'),
    dataIndex: 'rating',
    key: 'rating',
    width: 120,
    sorter: (a: Feedback, b: Feedback) => a.rating - b.rating,
    render: (rating: number) => `${rating}/5`,
    filters: [
      { text: '0.5', value: 0.5 },
      { text: '1', value: 1 },
      { text: '1.5', value: 1.5 },
      { text: '2', value: 2 },
      { text: '2.5', value: 2.5 },
      { text: '3', value: 3 },
      { text: '3.5', value: 3.5 },
      { text: '4', value: 4 },
      { text: '4.5', value: 4.5 },
      { text: '5', value: 5 },
    ],
    onFilter: (value: number, record: Feedback) => record.rating === value,
  },
  {
    title: t('Comment'),
    dataIndex: 'comment',
    key: 'comment',
    render: (comment: string) => (
      <Tooltip title={comment} placement="topLeft">
        {comment}
      </Tooltip>
    ),
    filters: [
      { text: t('Has comment'), value: true },
      { text: t('No comment'), value: false },
    ],
    onFilter: (value: boolean, record: Feedback) =>
      Boolean(record.comment) === value,
  },
  {
    title: t('From'),
    dataIndex: 'is_plugin',
    key: 'from',
    width: 90,
    render: (isPlugin: boolean) => (isPlugin ? 'OM' : 'Standalone'),
    filters: [
      { text: 'OM', value: true },
      { text: 'Standalone', value: false },
    ],
    sorter: (a: Feedback, b: Feedback) =>
      Number(a.is_plugin) - Number(b.is_plugin),
    onFilter: (value: boolean, record: Feedback) => record.is_plugin === value,
  },
];

const getMonthWeek = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based
  const day = date.getDate();

  // Находим первый день месяца
  const firstDayOfMonth = new Date(year, month, 1);

  // Вычисляем номер недели в месяце
  // Неделя начинается с понедельника
  const firstDayWeekday = firstDayOfMonth.getDay(); // 0 = воскресенье, 1 = понедельник
  const adjustedFirstDay = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1; // Преобразуем в 0 = понедельник

  // Номер недели в месяце
  const weekNumber = Math.ceil((day + adjustedFirstDay) / 7);

  const monthStr = String(month + 1).padStart(2, '0'); // 0-based to 1-based

  return `${year}-${monthStr}-W${weekNumber}`;
};

const groupFeedbackByGranularity = (
  feedbacks: Feedback[],
  granularity: Granularity,
) => {
  const result: Record<string, Record<string, number>> = {};

  feedbacks.forEach(feedback => {
    let label = '';

    if (granularity === 'day') {
      label = feedback.date; // '2025-04-05'
    } else if (granularity === 'week') {
      label = getMonthWeek(feedback.date); // '2025-10-W1'
    } else {
      label = feedback.date.slice(0, 7); // '2025-04'
    }

    if (!result[label]) {
      result[label] = {};
    }

    if (!result[label][feedback.rating]) {
      result[label][feedback.rating] = 0;
    }

    result[label][feedback.rating] += 1;
  });

  return result;
};

const prepareChartData = (
  groupedData: Record<string, Record<string, number>>,
) => {
  const labels = Object.keys(groupedData).sort(); // ['2025-01', ...]

  // Получаем все возможные рейтинги
  const allRatings = new Set<number>();
  Object.values(groupedData).forEach(ratings => {
    Object.keys(ratings).forEach(rating => {
      allRatings.add(Number(rating));
    });
  });

  const seriesData: Record<number, number[]> = {};

  // Инициализируем массивы для всех рейтингов
  Array.from(allRatings).forEach(rating => {
    seriesData[rating] = [];
  });

  // Заполняем данные для каждой метки
  labels.forEach(label => {
    Array.from(allRatings).forEach(rating => {
      const value = groupedData[label][rating] || 0;
      seriesData[rating].push(value);
    });
  });

  return { labels, seriesData };
};

const ratingColors: Record<string, string> = {
  0.5: '#ff6262',
  1: '#ff7868',
  1.5: '#ff8e6e',
  2: '#ffa574',
  2.5: '#ffbb7a',
  3: '#ffd17f',
  3.5: '#ffe68f',
  4: '#d4eb9d',
  4.5: '#aad6a3',
  5: '#65d46b',
};

export type Granularity = 'day' | 'week' | 'month';

export const getChartOptions = (
  data: Feedback[],
  granularity: Granularity,
  isStacked: boolean,
) => {
  const groupedData = groupFeedbackByGranularity(data, granularity);
  const { labels, seriesData } = prepareChartData(groupedData);

  // Только для дней используем временную ось с парами [время, значение]
  const series = Object.entries(seriesData)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([rating, dataValues]) => {
      let seriesData;

      if (granularity === 'day') {
        // Для дней создаем массив пар [время, значение]
        seriesData = labels.map((label, index) => {
          const timeValue = new Date(label).getTime();
          return [timeValue, dataValues[index]];
        });
      } else {
        // Для недель и месяцев используем обычные значения
        seriesData = dataValues;
      }

      return {
        name: `${t('Rating')} ${rating}`,
        type: 'bar',
        stack: isStacked ? 'Total' : rating,
        itemStyle: { color: ratingColors[rating] },
        data: seriesData,
      };
    });

  const xAxisConfig =
    granularity === 'day'
      ? {
          type: 'time' as const,
          axisLabel: {
            rotate: 45,
            interval: 'auto',
            formatter: (value: number) => {
              const date = new Date(value);
              return date.toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
            },
          },
        }
      : {
          type: 'category' as const,
          data: labels,
        };

  return {
    width: 668,
    height: 400,
    echartOptions: {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any[]) => {
          let label;
          if (granularity === 'day') {
            // Для дней используем axisValueLabel (временная ось)
            label = params[0]?.axisValueLabel;
            if (label) {
              const date = new Date(label);
              label = date.toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
            }
          } else {
            // Для недель и месяцев используем name (категориальная ось)
            label = params[0]?.name;
          }

          let result = `<strong>${label}</strong><br/>`;
          let total = 0;

          params.forEach(param => {
            if (!param.seriesName.startsWith('Rating')) return;
            const { value } = param;
            const actualValue = Array.isArray(value) ? value[1] : value;
            if (actualValue) {
              total += actualValue;
              result += `
                <span style="display:inline-block;margin:2px 0;">
                  <span style="display:inline-block;margin-right:8px;border-radius:10px;width:10px;height:10px;background:${param.color}"></span>
                  <strong>${param.seriesName}</strong>: ${actualValue}
                </span><br/>
              `;
            }
          });

          result += `<hr style="margin:5px 0;border:0;border-top:1px solid #ccc"/><strong>Total:</strong> ${total}`;
          return result;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: xAxisConfig,
      yAxis: {
        type: 'value',
        min: 0,
        max: 'dataMax',
      },
      series,
    },
    selectedValues: {},
    refs: {},
  };
};
