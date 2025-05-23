// DODO was here
import {
  ControlSetItem,
  // DODO commented out start 49751291
  // CustomControlConfig,
  // sharedControls,
  // InfoTooltipWithTrigger,
  // DODO commented out stop 49751291
} from '@superset-ui/chart-controls';
import { t } from '@superset-ui/core';
// DODO commented out start 49751291
// import { CodeEditor } from '../../components/CodeEditor/CodeEditor';
// import { ControlHeader } from '../../components/ControlHeader/controlHeader';
// import { debounceFunc } from '../../consts';

// interface StyleCustomControlProps {
//   value: string;
// }

// const StyleControl = (props: CustomControlConfig<StyleCustomControlProps>) => {
//   const theme = useTheme();

//   const defaultValue = props?.value
//     ? undefined
//     : `/*
//   .data-list {
//     background-color: yellow;
//   }
// */`;

//   return (
//     <div>
//       <ControlHeader>
//         <div>
//           {props.label}
//           <InfoTooltipWithTrigger
//             iconsStyle={{ marginLeft: theme.gridUnit }}
//             tooltip={t('You need to configure HTML sanitization to use CSS')}
//           />
//         </div>
//       </ControlHeader>
//       <CodeEditor
//         theme="dark"
//         mode="css"
//         value={props.value}
//         defaultValue={defaultValue}
//         onChange={source => {
//           debounceFunc(props.onChange, source || '');
//         }}
//       />
//     </div>
//   );
// };
// DODO commented out stop 49751291

export const styleControlSetItem: ControlSetItem = {
  name: 'styleTemplate',
  config: {
    // ...sharedControls.entity, // DODO commented out 49751291
    // DODO added start 49751291
    type: 'TextAreaControl',
    language: 'css',
    default: `/*
  .data-list {
    background-color: yellow;
  }
*/`,
    // DODO added stop 49751291
    label: t('CSS Styles'),
    description: t('CSS applied to the chart'),
    isInt: false,
    renderTrigger: true,

    validators: [],
    mapStateToProps: ({ controls }) => ({
      value: controls?.handlebars_template?.value,
    }),
  },
};
