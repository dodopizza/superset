// DODO created
import {
  CustomControlConfig,
  InfoTooltipWithTrigger,
  ControlSetItem,
  sharedControls,
} from '@superset-ui/chart-controls';
import { t, useTheme, FeatureFlag, isFeatureEnabled } from '@superset-ui/core';
import { debounce } from 'lodash';
import { CodeEditor } from '../../../components/CodeEditor/CodeEditor';
import { ControlHeader } from '../../../components/ControlHeader/controlHeader';

interface JsExecuteCodeCustomControlProps {
  value?: string;
  default?: string;
  onChange?: (value: string) => void;
}

const debounceFunc = debounce((func: Function, value: string) => {
  func(value);
}, 400);

const jsFunctionInfo = (
  <div>
    {t('This JavaScript code will be executed after the template is rendered.')}
    <br />
    {t('You can use it to add event handlers, manipulate DOM elements, etc.')}
  </div>
);

const JsExecuteCodeControl = (
  props: CustomControlConfig<JsExecuteCodeCustomControlProps>,
) => {
  const theme = useTheme();
  const val = String(
    props?.value ? props?.value : props?.default ? props?.default : '',
  );

  const defaultValue = props?.value
    ? undefined
    : `/**
 * JavaScript code to execute after the template is rendered
 * The code has access to:
 * - container: The DOM element containing the rendered template
 * - data: The data used to render the template
 *
 * Example:
 * const buttons = container.querySelectorAll('button');
 * buttons.forEach(button => {
 *   button.addEventListener('click', (e) => {
 *     console.log('Button clicked:', e.target.textContent);
 *   });
 * });
 */
function(container, data) {
  // Your code here
}`;

  return (
    <div>
      <ControlHeader>
        <div>
          {props.label}
          <InfoTooltipWithTrigger
            iconsStyle={{ marginLeft: theme.gridUnit }}
            tooltip={t(
              'Define JavaScript code to execute after the template is rendered',
            )}
          />
        </div>
      </ControlHeader>
      <CodeEditor
        theme="dark"
        mode="javascript"
        value={val}
        defaultValue={defaultValue}
        onChange={source => {
          debounceFunc(props.onChange, source || '');
        }}
        width="100%"
        height="300px"
        readOnly={!isFeatureEnabled(FeatureFlag.EnableJavascriptControls)}
      />
      {!isFeatureEnabled(FeatureFlag.EnableJavascriptControls) && (
        <div className="alert alert-warning" role="alert">
          {t(
            'This functionality is disabled in your environment for security reasons.',
          )}
        </div>
      )}
      {jsFunctionInfo}
    </div>
  );
};

export const jsExecuteCodeControlSetItem: ControlSetItem = {
  name: 'js_execute_code',
  config: {
    ...sharedControls.entity,
    type: JsExecuteCodeControl,
    label: t('JavaScript Execute Code'),
    description: t(
      'Define JavaScript code to execute after the template is rendered',
    ),
    default: `// function(container, data) {
  // container - обертка над графиком для доступа к элементам внутри, например
  // const element = container.querySelector('.element');
  // data - данные приходящие в график
  // console.log(data)
  // }`,
    isInt: false,
    renderTrigger: true,
    validators: [],
    mapStateToProps: ({ controls }) => ({
      value: controls?.js_execute_code?.value,
    }),
  },
};
