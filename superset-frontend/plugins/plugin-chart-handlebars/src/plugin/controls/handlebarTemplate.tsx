// DODO was here
import 'ace-builds/src-min-noconflict/mode-handlebars'; // DODO added 49751291
import {
  ControlSetItem,
  // CustomControlConfig, // DODO commented out 49751291
  // sharedControls, // DODO commented out 49751291
} from '@superset-ui/chart-controls';
import { t, validateNonEmpty } from '@superset-ui/core';
// DODO commented out start 49751291
// import { CodeEditor } from '../../components/CodeEditor/CodeEditor';
// import { ControlHeader } from '../../components/ControlHeader/controlHeader';
// import { debounceFunc } from '../../consts';

// interface HandlebarsCustomControlProps {
//   value: string;
// }

// const HandlebarsTemplateControl = (
//   props: CustomControlConfig<HandlebarsCustomControlProps>,
// ) => {
//   const val = String(
//     props?.value ? props?.value : props?.default ? props?.default : '',
//   );

//   return (
//     <div>
//       <ControlHeader>{props.label}</ControlHeader>
//       <CodeEditor
//         theme="dark"
//         value={val}
//         onChange={source => {
//           debounceFunc(props.onChange, source || '');
//         }}
//       />
//     </div>
//   );
// };
// DODO commented out stop 49751291

export const handlebarsTemplateControlSetItem: ControlSetItem = {
  name: 'handlebarsTemplate',
  config: {
    // ...sharedControls.entity, // DODO commented out 49751291
    type: 'TextAreaControl', // DODO added 49751291
    language: 'handlebars', // DODO added 49751291
    label: t('Handlebars Template'),
    description: t('A handlebars template that is applied to the data'),
    default: `<ul class="data-list">
  {{#each data}}
    <li>{{stringify this}}</li>
  {{/each}}
</ul>`,
    isInt: false,
    renderTrigger: true,

    validators: [validateNonEmpty],
    mapStateToProps: ({ controls }) => ({
      value: controls?.handlebars_template?.value,
    }),
  },
};
