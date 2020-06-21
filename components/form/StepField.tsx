import { FunctionComponent, FocusEvent } from "react";
import { FastField as Field, FieldProps, getIn, FormikHelpers, FormikErrors, FormikTouched } from "formik";
import { InputGroup } from "@blueprintjs/core";
import { FormValues, StepFormField } from "./RecipeForm";
import { DurationPicker } from "./DurationPicker";
import { Button } from "components/base/Button";
import { TD } from "components/base/TD";
import { icon } from "lib/icons";
import { formatString } from "lib/field-helpers";

interface Props {
  index: number,
  setFieldValue: FormikHelpers<any>['setFieldValue'],
  onRemove: Function,
  errors: FormikErrors<FormValues>,
  touched: FormikTouched<FormValues>,
  validateField: FormikHelpers<any>['validateField']
}

export const StepField: FunctionComponent<Props> = ({ index, setFieldValue, validateField, onRemove, errors, touched }) => {
  const descriptionIntent = getIn(errors, `steps.${index}.description`) && getIn(touched, `steps.${index}.description`) ? "danger" : "none"

  return (
    <>
      <TD><Button icon={icon("remove")} onClick={() => onRemove()} minimal={true} /></TD>
      <TD>
        <Field name={`steps.${index}.description`}>
          {({ field }: FieldProps<StepFormField['description']>) => (
            <InputGroup
              intent={descriptionIntent}
              value={field.value}
              onChange={field.onChange}
              onBlur={(event: FocusEvent<HTMLInputElement>) => {
                event.target.value = formatString(event.target.value)
                field.onBlur(event)
              }}
              name={field.name}
              placeholder="Description" />
          )}
        </Field>
      </TD>
      <TD>
        <Field name={`steps.${index}.duration`}>
          {({ field }: FieldProps<StepFormField['duration']>) => (
            <DurationPicker
              field={field}
              setFieldValue={setFieldValue}
              validateField={validateField}
              errors={errors}
              touched={touched} />
          )}
        </Field>
      </TD>
    </>
  )
}