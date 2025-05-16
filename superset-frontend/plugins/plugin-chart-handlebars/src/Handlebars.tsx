// DODO was here
import { styled } from '@superset-ui/core';
import { createRef } from 'react';
import { HandlebarsViewer } from './components/Handlebars/HandlebarsViewer';
import { HandlebarsProps, HandlebarsStylesProps } from './types';

const Styles = styled.div<HandlebarsStylesProps>`
  // padding: ${({ theme }) => theme.gridUnit * 4}px; // DODO changed 49751291
  border-radius: ${({ theme }) => theme.gridUnit * 2}px;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  overflow: auto;
`;

export default function Handlebars(props: HandlebarsProps) {
  const { data, height, width, formData } = props;
  const styleTemplateSource = formData.styleTemplate
    ? `<style>${formData.styleTemplate}</style>`
    : '';
  const handlebarTemplateSource = formData.handlebarsTemplate
    ? formData.handlebarsTemplate
    : '{{data}}';
  const templateSource = `${handlebarTemplateSource}\n${styleTemplateSource} `;

  const rootElem = createRef<HTMLDivElement>();

  return (
    <Styles ref={rootElem} height={height} width={width}>
      <HandlebarsViewer
        data={{ data }}
        templateSource={templateSource}
        allowNavigationTools={formData.allowNavigationTools} // DODO added 49751291
        jsExecuteCode={formData.jsExecuteCode} // DODO added 49751291
      />
    </Styles>
  );
}
