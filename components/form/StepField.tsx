import { FunctionComponent } from "react";
import { Field, FieldProps, getIn, FormikHelpers, FormikErrors, FormikTouched } from "formik";
import { Button, InputGroup } from "@blueprintjs/core";
import { FormValues } from "./RecipeForm";
import styled from "styled-components";
import { NumericInput } from "./NumericInput";

interface Props {
  index: number,
  setFieldValue: FormikHelpers<any>['setFieldValue'],
  onRemove: Function,
  errors: FormikErrors<FormValues>,
  touched: FormikTouched<FormValues>
}

const TD = styled.td`
  && {
    vertical-align: baseline;
  }
`

export const StepField: FunctionComponent<Props> = ({ index, setFieldValue, onRemove, errors, touched }) => {
  const durationIntent = getIn(errors, `steps.${index}.duration`) && getIn(touched, `steps.${index}.duration`) ? "danger" : "none"
  const descriptionIntent = getIn(errors, `steps.${index}.description`) && getIn(touched, `steps.${index}.description`) ? "danger" : "none"

  return (
    <tr>
      <TD><Button icon="remove" onClick={() => onRemove()} minimal={true} /></TD>
      <TD>
        <Field name={`steps.${index}.description`}>
          {({ field }: FieldProps<string>) => (
            <InputGroup
              intent={descriptionIntent}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              placeholder="Description" />
          )}
        </Field>
      </TD>
      <TD>
        <Field name={`steps.${index}.duration`}>
          {({ field }: FieldProps<number>) => (
            <NumericInput
              inputProps={{
                intent: durationIntent,
                value: field.value,
                onValueChange: (value) => setFieldValue(`steps.${index}.duration`, value),
                onBlur: field.onBlur,
                name: field.name
              }} />
          )}
        </Field>
      </TD>
    </tr>
  )
}