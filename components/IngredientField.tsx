import { FunctionComponent } from "react";
import { IngredientType } from "../graphql";
import { Field, FieldProps, getIn } from "formik";
import { HTMLSelect, InputGroup } from "@blueprintjs/core";
import { NumericInput } from "./NumericInput";
import { ingredientTypes } from "../lib/ingredients";
import { FormValues } from "./RecipeForm";

interface Props {
  prefix: string,
  index: number,
  setFieldValue: Function,
  formValues: FormValues
}

export const IngredientField: FunctionComponent<Props> = ({ prefix, index, setFieldValue, formValues }) => {
  const nameRequired = getIn(formValues, `${prefix}Ingredients.${index}.type`) === IngredientType.flour
    || getIn(formValues, `${prefix}Ingredients.${index}.type`) === IngredientType.other

  return <>
    <Field name={`${prefix}Ingredients.${index}.type`}>
      {({ field }: FieldProps<IngredientType>) => (
        <HTMLSelect
          value={field.value}
          onChange={field.onChange}
          name={field.name}>
            {ingredientTypes.map((type, index) => <option key={index} value={type.value}>{type.label}</option>)}
        </HTMLSelect>
      )}
    </Field>

    {nameRequired && <Field as={InputGroup} placeholder="Name" name={`${prefix}Ingredients.${index}.name`} />}

    <Field name={`${prefix}Ingredients.${index}.weight`}>
      {({ field }: FieldProps<number>) => (
        <NumericInput setFieldValue={setFieldValue} value={field.value} name={field.name} />
      )}
    </Field>
  </>
}