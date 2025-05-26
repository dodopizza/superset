// DODO created
import { ControlSetItem } from '@superset-ui/chart-controls';
import { styled, t } from '@superset-ui/core';

const InfoWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.gridUnit * 3}px;
`;

const jsFunctionInfo = (
  <InfoWrapper>
    {t('This JavaScript code will be executed after the template is rendered.')}
    <br />
    {t(
      'You can use it to add event handlers, manipulate DOM elements inside container, etc.',
    )}
  </InfoWrapper>
);

export const jsExecuteCodeControlSetItem: ControlSetItem = {
  name: 'js_execute_code',
  config: {
    type: 'TextAreaControl',
    language: 'javascript',
    label: t('JavaScript Code'),
    description: t(
      'Define JavaScript code to execute after the template is rendered',
    ),
    aboveEditorSection: jsFunctionInfo,
    default: `// function(container, data) {
//   // container - обертка над графиком для доступа к элементам внутри, например
//   const dataList = container.querySelector('.data-list');
//   // нажать F12(Fn + F12), чтобы открыть панель разработчика и перейти в консоль
//   console.log('dataList', dataList);
//   // data - данные, приходящие в график
//   console.log('data', data)
// }`,
    isInt: false,
    renderTrigger: true,
    validators: [],
    mapStateToProps: ({ controls }) => ({
      value: controls?.js_execute_code?.value,
    }),
  },
};
