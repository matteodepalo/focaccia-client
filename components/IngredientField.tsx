import { FunctionComponent } from "react";
import { IngredientType } from "../graphql";
import { Field, FieldProps, getIn, FormikHelpers, FormikErrors, FormikTouched } from "formik";
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
  onRemove?: Function,
  errors: FormikErrors<FormValues>,
  validateField: FormikHelpers<any>['validateField'],
  touched: FormikTouched<FormValues>
}

export const IngredientField: FunctionComponent<Props> = ({ prefix, index, setFieldValue, formValues, onRemove, errors, validateField, touched }) => {
  const type = getIn(formValues, `${prefix}Ingredients.${index}.type`) as IngredientType
  const nameRequired = nameRequiredForType(type)
  const weightIntent = getIn(errors, `${prefix}Ingredients.${index}.weight`) && getIn(touched,  `${prefix}Ingredients.${index}.weight`) ? "danger" : "none"
  const nameIntent = getIn(errors, `${prefix}Ingredients.${index}.name`) && getIn(touched, `${prefix}Ingredients.${index}.name`) ? "danger" : "none"

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
                    <WeightInput
                      intent={weightIntent}
                      setFieldValue={setFieldValue}
                      onBlur={field.onBlur}
                      value={field.value}
                      name={field.name}
                      validateField={validateField} />
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
                      <InputGroup
                        intent={nameIntent}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        placeholder="Name" />
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