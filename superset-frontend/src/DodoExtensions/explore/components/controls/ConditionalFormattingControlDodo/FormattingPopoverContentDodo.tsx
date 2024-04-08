// // DODO was here

import {ConditionalFormattingConfig} from "../../../../../explore/components/controls/ConditionalFormattingControl";
import {FormatingPopoverRenderFormContent} from "../ConditionalFormattingControlDodoWrapper/types";
import {Col, Row} from "../../../../../components";
import {FormItem} from "../../../../../components/Form";
import {styled, t} from "@superset-ui/core";
import Select from "../../../../../components/Select/Select";
import ColorPickerControlDodo from "../ColorPickerControlDodo";
import Button from "../../../../../components/Button";
import {
  FormattingPopoverContentDodoWrapper
} from "../ConditionalFormattingControlDodoWrapper/FormattingPopoverContentDodoWrapper";
import React from "react";

const JustifyEnd = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const FormattingPopoverContentDodo =(props: {
  config?: ConditionalFormattingConfig;
  onChange: (config: ConditionalFormattingConfig) => void;
  columns: { label: string; value: string }[];
})=> {
  const renderFormContent: FormatingPopoverRenderFormContent = (
    {
      rulesRequired,
      columns,
      colorScheme ,
      colorsValues,
      chosenColor,
      setChosenColor,
      shouldFormItemUpdate,
      renderOperatorFields,
      parseColorValue
    }) => {
    return (
      <>
        <Row gutter={12}>
          <Col span={16}>
            <FormItem
              name="colorScheme"
              label={t('Color scheme')}
              rules={rulesRequired}
              initialValue={colorScheme[0].value}
            >
              {/* DODO changed */}
              <Select
                ariaLabel={t('Color scheme')}
                options={colorsValues}
                onChange={value => {
                  // @ts-ignore
                  parseColorValue(value);
                }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              name="colorScheme"
              label={t('Color')}
              initialValue={chosenColor}
            >
              <ColorPickerControlDodo // DODO changed
                onChange={(picked: string) => {
                  setChosenColor(picked);
                }}
                value={chosenColor}
                isHex
              />
            </FormItem>
          </Col>
        </Row>
        <FormItem noStyle shouldUpdate={shouldFormItemUpdate}>
          {renderOperatorFields}
        </FormItem>
        <FormItem>
          <JustifyEnd>
            <Button htmlType="submit" buttonStyle="primary">
              {t('Apply')}
            </Button>
          </JustifyEnd>
        </FormItem>
      </>
    );
  }

  return <FormattingPopoverContentDodoWrapper {...props} renderFormContent={ renderFormContent }/>;
}
