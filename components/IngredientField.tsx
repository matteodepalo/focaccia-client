import { FunctionComponent } from "react";
import { IngredientType } from "../graphql";
import { Field, FieldProps, getIn, FormikHelpers } from "formik";
import { HTMLSelect, InputGroup, Button } from "@blueprintjs/core";
import { WeightInput } from "./WeightInput";
import { ingredientTypes } from "../lib/ingredients";
import { FormValues } from "./RecipeForm";
import { nameRequiredForType } from "../lib/recipe";
import { Flex, Box } from "rebass/styled-components";

interface Props {
  prefix: string,
  index: number,
  setFieldValue: FormikHelpers<any>['setFieldValue'],
  formValues: FormValues,
  onRemove: Function
}

export const IngredientField: FunctionComponent<Props> = ({ prefix, index, setFieldValue, formValues, onRemove }) => {
  const nameRequired = nameRequiredForType(getIn(formValues, `${prefix}Ingredients.${index}.type`))

  return (
    <Flex mb={2} key={index} alignItems="center">
      <Box>
        <Flex flexDirection={["column", "row"]}>
          <Box mb={1} mr={1}>
            <Flex>
              <Box mr={1}>
                <Field name={`${prefix}Ingredients.${index}.type`}>
                  {({ field }: FieldProps<IngredientType>) => (
                    <HTMLSelect
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}>
                        {ingredientTypes.map((type, index) => <option key={index} value={type.value}>{type.label}</option>)}
                    </HTMLSelect>
                  )}
                </Field>
              </Box>

              <Box>
                <Field name={`${prefix}Ingredients.${index}.weight`}>
                  {({ field }: FieldProps<number>) => (
                    <WeightInput setFieldValue={setFieldValue} onBlur={field.onBlur} value={field.value} name={field.name} />
                  )}
                </Field>
              </Box>
            </Flex>
          </Box>

          {nameRequired &&
            <Box>
              <Field name={`${prefix}Ingredients.${index}.name`}>
                {({ field }: FieldProps<string>) => (
                  <InputGroup value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} name={field.name} placeholder="Name" />
                )}
              </Field>
            </Box>}
        </Flex>
      </Box>

      <Box>
        <Button icon="remove" onClick={() => onRemove()} minimal={true} />
      </Box>
    </Flex>
  )
}