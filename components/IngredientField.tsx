import { FunctionComponent } from "react";
import { IngredientType } from "../graphql";
import { Field, FieldProps, getIn, FormikHelpers } from "formik";
import { InputGroup, Button } from "@blueprintjs/core";
import { WeightInput } from "./WeightInput";
import { labelForIngredientType, nameRequiredForType } from "../lib/ingredients";
import { FormValues } from "./RecipeForm";
import { Flex, Box } from "rebass/styled-components";
import { lowerCase } from "lodash";

interface Props {
  prefix: string,
  index: number,
  setFieldValue: FormikHelpers<any>['setFieldValue'],
  formValues: FormValues,
  onRemove?: Function
}


export const IngredientField: FunctionComponent<Props> = ({ prefix, index, setFieldValue, formValues, onRemove }) => {
  const type = getIn(formValues, `${prefix}Ingredients.${index}.type`) as IngredientType
  const nameRequired = nameRequiredForType(type)

  return (
    <Flex mb={2} alignItems="center">
      <Box mr={2}>
        <Button icon="remove" disabled={typeof onRemove === 'undefined'} onClick={() => onRemove?.()} minimal={true}  />
      </Box>

      <Box>
        <Flex flexDirection={["column", "row"]}>
          <Box mb={1} mr={1}>
            <Flex alignItems="center">
              <Box>
                <Field name={`${prefix}Ingredients.${index}.weight`}>
                  {({ field }: FieldProps<number>) => (
                    <WeightInput setFieldValue={setFieldValue} onBlur={field.onBlur} value={field.value} name={field.name} />
                  )}
                </Field>
              </Box>

              {type !== IngredientType.other &&
                <Box ml={2}>
                  of {lowerCase(labelForIngredientType(type))}
                </Box>}


              {nameRequired &&
                <Box ml={2}>
                  <Field name={`${prefix}Ingredients.${index}.name`}>
                    {({ field }: FieldProps<string>) => (
                      <InputGroup value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} name={field.name} placeholder="Name" />
                    )}
                  </Field>
                </Box>}
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Flex>
  )
}