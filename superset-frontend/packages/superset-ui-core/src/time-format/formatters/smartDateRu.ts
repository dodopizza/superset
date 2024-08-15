import createMultiFormatter from '../factories/createMultiFormatter';

const smartDateRuFormatter = createMultiFormatter({
  id: 'smart_date_ru',
  label: 'Adaptive formatting ru',
  formats: {
    millisecond: '.%Lms',
    second: ':%Ss',
    minute: '%I:%M',
    hour: '%I %p',
    day: '%a %d',
    week: '%b %d',
    month: '%B',
    year: '%Y',
  },
});

export default smartDateRuFormatter;
