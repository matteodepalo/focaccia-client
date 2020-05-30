import { FunctionComponent } from "react";
import { IngredientType } from "../graphql";
import { Field, FieldProps, getIn, FormikHelpers } from "formik";
import { HTMLSelect, InputGroup, Button } from "@blueprintjs/core";
import { WeightInput } from "./WeightInput";
import { ingredientTypes, labelForIngredientType } from "../lib/ingredients";
import { FormValues } from "./RecipeForm";
import { nameRequiredForType, uniqueIngredientTypes } from "../lib/recipe";
import { Flex, Box } from "rebass/styled-components";
import styled from "styled-components";

interface Props {
  prefix: string,
  index: number,
  setFieldValue: FormikHelpers<any>['setFieldValue'],
  formValues: FormValues,
  onRemove?: Function,
  type: IngredientType
}

const HiddenField = styled(Field)`
  display: none
`

export const IngredientField: FunctionComponent<Props> = ({ prefix, index, setFieldValue, formValues, onRemove, type }) => {
  const nameRequired = nameRequiredForType(type || getIn(formValues, `${prefix}Ingredients.${index}.type`))

  return (
    <Flex mb={2} alignItems="center">
      <Box>
        <Flex flexDirection={["column", "row"]}>
          <Box mb={1} mr={1}>
            <Flex alignItems="center">
              <Box mr={2}>
                <Field name={`${prefix}Ingredients.${index}.weight`}>
                  {({ field }: FieldProps<number>) => (
                    <WeightInput setFieldValue={setFieldValue} onBlur={field.onBlur} value={field.value} name={field.name} />
                  )}
                </Field>
              </Box>

              <span> of </span>

              <Box ml={2}>
                {uniqueIngredientTypes.includes(type) ?
                  <>
                    {labelForIngredientType(type)}
                    <HiddenField value={type} name={`${prefix}Ingredients.${index}.type`}/>
                  </> :
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
                  </Field>}
              </Box>

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

      {onRemove &&
        <Box>
          <Button icon="remove" onClick={() => onRemove()} minimal={true}  />
        </Box>}
    </Flex>
  )
}