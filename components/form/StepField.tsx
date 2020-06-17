import { FunctionComponent } from "react";
import { FastField as Field, FieldProps, getIn, FormikHelpers, FormikErrors, FormikTouched } from "formik";
import { InputGroup } from "@blueprintjs/core";
import { FormValues } from "./RecipeForm";
import { DurationPicker } from "./DurationPicker";
import { Button } from "components/base/Button";
import { TD } from "components/base/TD";
import { icon } from "lib/icons";

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