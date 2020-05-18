import { FunctionComponent } from "react";
import { IngredientType } from "../graphql";
import { labelForIngredientType } from "../lib/ingredients";
import { Field, FieldProps } from "formik";
import { HTMLSelect, InputGroup } from "@blueprintjs/core";
import { NumericInput } from "./NumericInput";

interface Props {
  prefix: string,
  index: number,
  setFieldValue: Function
}

export const IngredientField: FunctionComponent<Props> = ({ prefix, index, setFieldValue }) => {
  let types: { value: string, label?: string }[] = [];

  for (let value in IngredientType) {
    types.push({
      value: value,
      label: labelForIngredientType(value)
    })
  }

  return <>
    <Field name={`${prefix}Ingredients.${index}.type`}>
      {({ field }: FieldProps<IngredientType>) => (
        <HTMLSelect
          value={field.value}
          onChange={field.onChange}
          name={field.name}>
            {types.map((type, index) => <option key={index} value={type.value}>{type.label}</option>)}
        </HTMLSelect>
      )}
    </Field>

    <Field as={InputGroup} placeholder="Name" name={`${prefix}Ingredients.${index}.name`} />

    <Field name={`${prefix}Ingredients.${index}.weight`}>
      {({ field }: FieldProps<number>) => (
        <NumericInput setFieldValue={setFieldValue} value={field.value} name={field.name} />
      )}
    </Field>
  </>
}