// DODO created
import { ControlSetItem } from '@superset-ui/chart-controls';
import { t } from '@superset-ui/core';

const jsFunctionInfo = (
  <div>
    {t('This JavaScript code will be executed after the template is rendered.')}
    <br />
    {t('You can use it to add event handlers, manipulate DOM elements, etc.')}
  </div>
);

export const jsExecuteCodeControlSetItem: ControlSetItem = {
  name: 'js_execute_code',
  config: {
    type: 'TextAreaControl',
    language: 'javascript',
    label: t('JavaScript Execute Code'),
    description: t(
      'Define JavaScript code to execute after the template is rendered',
    ),
    aboveEditorSection: jsFunctionInfo,
    default: `// function(container, data) {
//   // container - обертка над графиком для доступа к элементам внутри, например
//   const element = container.querySelector('.element');
//   // data - данные приходящие в график
//   console.log(data)
// }`,
    isInt: false,
    renderTrigger: true,
    validators: [],
    mapStateToProps: ({ controls }) => ({
      value: controls?.js_execute_code?.value,
    }),
  },
};
