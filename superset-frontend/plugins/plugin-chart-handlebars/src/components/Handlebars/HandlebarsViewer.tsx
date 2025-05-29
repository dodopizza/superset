// DODO was here
import {
  SafeMarkdown,
  styled,
  t,
  FeatureFlag,
  isFeatureEnabled,
} from '@superset-ui/core';
import Handlebars from 'handlebars';
import moment from 'moment';
import { useMemo, useState, useRef, useEffect } from 'react';
import { isPlainObject } from 'lodash';
import Helpers from 'just-handlebars-helpers';
import Navigable from '../../DodoExtensions/components/Navigable'; // DODO added 49751291
import sandboxedEval from '../../utils/sandbox'; // DODO added 49751291

interface HandlebarsViewerPropsDodoExtended {
  allowNavigationTools?: boolean; // DODO added 49751291
  jsExecuteCode?: string; // DODO added 49751291
}
export interface HandlebarsViewerProps
  extends HandlebarsViewerPropsDodoExtended {
  templateSource: string;
  data: any;
}

// DODO added 49751291
const ErrorStyled = styled.pre`
  white-space: pre-wrap;
`;

export const HandlebarsViewer = ({
  templateSource,
  data,
  allowNavigationTools = false, // DODO added 49751291
  jsExecuteCode, // DODO added 49751291
}: HandlebarsViewerProps) => {
  const [renderedTemplate, setRenderedTemplate] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null); // DODO added 49751291
  const appContainer = document.getElementById('app');
  const { common } = JSON.parse(
    appContainer?.getAttribute('data-bootstrap') || '{}',
  );
  // DODO changed 44611022
  const htmlSanitization =
    common?.conf?.HTML_SANITIZATION ?? window.htmlSanitization ?? true;
  const htmlSchemaOverrides =
    common?.conf?.HTML_SANITIZATION_SCHEMA_EXTENSIONS || {};

  useMemo(() => {
    try {
      const template = Handlebars.compile(templateSource);
      const result = template(data);
      setRenderedTemplate(result);
      setError('');
    } catch (error) {
      setRenderedTemplate('');
      setError((error as Error).message);
    }
  }, [templateSource, data]);

  // DODO added 49751291
  // Execute JavaScript code after the template is rendered
  useEffect(() => {
    if (
      containerRef.current &&
      renderedTemplate &&
      jsExecuteCode &&
      isFeatureEnabled(FeatureFlag.EnableJavascriptControls)
    ) {
      try {
        const jsFunction = sandboxedEval(jsExecuteCode);
        if (typeof jsFunction === 'function') {
          jsFunction(containerRef.current, data);
        } else {
          console.warn('JavaScript execute code must be a function');
        }
      } catch (error) {
        console.warn('Error executing JavaScript code:', error);
      }
    }
  }, [renderedTemplate, jsExecuteCode, data]);

  if (error) {
    return <ErrorStyled>{error}</ErrorStyled>; // DODO changed 49751291
  }

  if (renderedTemplate) {
    // DODO changed start 49751291
    // Create a wrapper div with a ref to access the DOM
    const content = (
      <div ref={containerRef}>
        <SafeMarkdown
          source={renderedTemplate}
          htmlSanitization={htmlSanitization}
          htmlSchemaOverrides={htmlSchemaOverrides}
        />
      </div>
    );

    return allowNavigationTools ? <Navigable>{content}</Navigable> : content;
    // DODO changed stop 49751291
  }
  return <p>{t('Loading...')}</p>;
};

//  usage: {{dateFormat my_date format="MMMM YYYY"}}
Handlebars.registerHelper('dateFormat', function (context, block) {
  const f = block.hash.format || 'YYYY-MM-DD';
  return moment(context).format(f);
});

// usage: {{  }}
Handlebars.registerHelper('stringify', (obj: any, obj2: any) => {
  // calling without an argument
  if (obj2 === undefined)
    throw Error('Please call with an object. Example: `stringify myObj`');
  return isPlainObject(obj) ? JSON.stringify(obj) : String(obj);
});

Helpers.registerHelpers(Handlebars);
