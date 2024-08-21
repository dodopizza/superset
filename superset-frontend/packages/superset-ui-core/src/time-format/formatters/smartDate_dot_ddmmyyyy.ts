// DODO created file #34239342
import createMultiFormatter from '../factories/createMultiFormatter';

const smartDateFormatter_dot_ddmmyyyy = createMultiFormatter({
  id: 'smart_date_dot_ddmmyyyy',
  label: 'Adaptive formatting dot ddmmyyyy',
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

export default smartDateFormatter_dot_ddmmyyyy;
