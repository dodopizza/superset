// DODO was here
import { SafeMarkdown, styled, t } from '@superset-ui/core';
import Handlebars from 'handlebars';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { isPlainObject } from 'lodash';
import Helpers from 'just-handlebars-helpers';
import Navigable from '../../DodoExtensions/components/Navigable'; // DODO added 49751291

interface HandlebarsViewerPropsDodoExtended {
  allowNavigationTools?: boolean; // DODO added 49751291
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
}: HandlebarsViewerProps) => {
  const [renderedTemplate, setRenderedTemplate] = useState('');
  const [error, setError] = useState('');
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

  if (error) {
    return <ErrorStyled>{error}</ErrorStyled>; // DODO changed 49751291
  }

  if (renderedTemplate) {
    // DODO changed 49751291
    return allowNavigationTools ? (
      <Navigable>
        <SafeMarkdown
          source={renderedTemplate}
          htmlSanitization={htmlSanitization}
          htmlSchemaOverrides={htmlSchemaOverrides}
        />
      </Navigable>
    ) : (
      <SafeMarkdown
        source={renderedTemplate}
        htmlSanitization={htmlSanitization}
        htmlSchemaOverrides={htmlSchemaOverrides}
      />
    );
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
