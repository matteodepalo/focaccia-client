import { FunctionComponent } from "react";
import { IngredientType } from "lib/graphql";
import { FastField as Field, FieldProps, getIn, FormikHelpers, FormikErrors, FormikTouched } from "formik";
import { Tag } from "@blueprintjs/core";
import { nameRequiredForType } from "lib/ingredients";
import { FormValues, IngredientFormField } from "./RecipeForm";
import { Flex, Box } from "rebass/styled-components";
import { lowerCase } from "lodash";
import { NumericInput } from "components/base/NumericInput";
import { Button } from "components/base/Button";
import { icon } from "lib/icons";
import { wrapNullableValue } from "lib/field-helpers";
import { TextInput } from "components/base/TextInput";
import i18n from "i18n";

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

  const [t] = i18n.useTranslation()

  return (
    <Flex mb={2} alignItems="center">
      <Box mr={2}>
        <Button icon={icon("remove")} disabled={disabled} onClick={() => onRemove?.()} minimal={true}  />
      </Box>

      <Box>
        <Flex flexDirection={["column", "row"]}>
          <Box>
            <Flex alignItems="center">
              <Box mr={2}>
                <Field name={`${prefix}Ingredients.${index}.weight`}>
                  {({ field }: FieldProps<IngredientFormField['weight']>) => (
                    <NumericInput
                      onChange={(value) => setFieldValue(field.name, value)}
                      validateField={validateField}
                      name={field.name}
                      value={field.value}
                      containerProps={{ width: 120 }}
                      onBlur={field.onBlur}
                      rightElement={<Tag minimal={true}>g</Tag>}
                      intent={weightIntent}
                     />
                  )}
                </Field>
              </Box>

              {type !== IngredientType.other &&
                <Box mr={2}>
                  {lowerCase(t(type))}
                </Box>}
            </Flex>
          </Box>

          {nameRequired &&
            <Box pt={[1, 0]}>
              <Field name={`${prefix}Ingredients.${index}.name`}>
                {({ field }: FieldProps<IngredientFormField['name']>) => (
                  <TextInput
                    intent={nameIntent}
                    value={wrapNullableValue(field.value)}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    placeholder={type === IngredientType.flour ? t('flour-placeholder') : t('other-placeholder')} />
                )}
              </Field>
            </Box>}
        </Flex>
      </Box>
    </Flex>
  )
}