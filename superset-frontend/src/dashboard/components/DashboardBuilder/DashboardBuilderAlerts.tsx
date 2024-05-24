// DODO added #34037254

import React, { useEffect, useMemo, useState } from 'react';
import { styled } from '@superset-ui/core';
import { SingleAnnotation } from '../../../Superstructure/types/global';
import { loadAnnotationMessages } from '../../../utils/annotationUtils';
import { WarningPanel } from '../../../DodoExtensions/components/WarningPanel';

/* TODO: добавить возможность закрыть каждый месседж, хранить в стейте */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 32px;
  row-gap: 12px;
`;

const useAlertsMessages = () => {
  const [annotationMessages, setAnnotationMessages] = useState<
    Array<SingleAnnotation>
  >([]);

  useEffect(() => {
    loadAnnotationMessages().then(result => setAnnotationMessages(result));
  }, []);

  const getColorsFromJson = (json_metadata: string) => {
    if (json_metadata) {
      const { backgroundColor = '#fff3cd', textColor = '#856404' } =
        JSON.parse(json_metadata);
      return { backgroundColor, textColor };
    }
    // eslint-disable-next-line theme-colors/no-literal-colors
    return { backgroundColor: '#fff3cd', textColor: '#856404' };
  };

  const alerts = useMemo(
    () => (
      <>
        {annotationMessages && (
          <Wrapper>
            {annotationMessages.map(message => (
              <WarningPanel
                // title="title"
                // subTitle="subTitle"
                // extra="extra"
                body={message.long_descr}
                colors={getColorsFromJson(message.json_metadata)}
              >
                childern
              </WarningPanel>
            ))}
          </Wrapper>
        )}
      </>
    ),
    [annotationMessages],
  );

  return {
    alerts,
  };
};

export { useAlertsMessages };
