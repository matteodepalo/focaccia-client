import { FunctionComponent } from "react";
import { IngredientType } from "lib/graphql";
import { FastField as Field, FieldProps, getIn, FormikHelpers, FormikErrors, FormikTouched } from "formik";
import { InputGroup, Tag } from "@blueprintjs/core";
import { labelForIngredientType, nameRequiredForType } from "lib/ingredients";
import { FormValues } from "./RecipeForm";
import { Flex, Box } from "rebass/styled-components";
import { lowerCase } from "lodash";
import { NumericInput } from "components/base/NumericInput";
import { Button } from "components/base/Button";

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
  const weightIntent = getIn(errors, `${prefix}Ingredients.${index}.weight`) && getIn(touched, `${prefix}Ingredients.${index}.weight`) ? "danger" : "none"
  const nameIntent = getIn(errors, `${prefix}Ingredients.${index}.name`) && getIn(touched, `${prefix}Ingredients.${index}.name`) ? "danger" : "none"
  const disabled = typeof onRemove === 'undefined'

  return (
    <Flex mb={2} alignItems="center">
      <Box mr={2}>
        <Button icon="remove" disabled={disabled} onClick={() => onRemove?.()} minimal={true}  />
      </Box>

      <Box>
        <Flex flexDirection={["column", "row"]}>
          <Box>
            <Flex alignItems="center">
              <Box>
                <Field name={`${prefix}Ingredients.${index}.weight`}>
                  {({ field }: FieldProps<number>) => (
                    <NumericInput
                      onChange={(value) => setFieldValue(field.name, value)}
                      validateField={validateField}
                      name={field.name}
                      value={field.value}
                      boxProps={{ width: 120 }}
                      onBlur={field.onBlur}
                      inputProps={{
                        rightElement: <Tag minimal={true}>g</Tag>,
                        intent: weightIntent
                      }} />
                  )}
                </Field>
              </Box>

              {type !== IngredientType.other &&
                <Box ml={2} mr={2}>
                  of {lowerCase(labelForIngredientType(type))}
                </Box>}
            </Flex>
          </Box>

          {nameRequired &&
            <Box pt={[1, 0]}>
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
  )
}