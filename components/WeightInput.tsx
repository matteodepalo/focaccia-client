import { Tag, Intent } from '@blueprintjs/core'
import { FunctionComponent } from "react"
import { NumericInput } from './NumericInput'
import { FieldProps, FormikHelpers } from 'formik'

interface Props {
  value: number
  setFieldValue: FormikHelpers<any>['setFieldValue']
  name: string
  onBlur: FieldProps<number>['field']['onBlur']
  intent: Intent,
  validateField: FormikHelpers<any>['validateField']
}

const handleNumericInputChange = (setFieldValue: FormikHelpers<any>['setFieldValue'], name: string) => (valueAsNumber: number, valueAsString: string) => {
  if (!isNaN(valueAsNumber) && valueAsString.length > 0) {
    setFieldValue(name, valueAsNumber)
  } else {
    setFieldValue(name, undefined)
  }
}

export const WeightInput: FunctionComponent<Props> = ({ value, setFieldValue, name, onBlur, intent, validateField }) => {
  return <NumericInput
    boxProps={{ width: 120 }}
    inputProps={{
      allowNumericCharactersOnly: true,
      value: value === 0 ? undefined : value,
      onBlur: onBlur,
      onValueChange: handleNumericInputChange(setFieldValue, name),
      rightElement: <Tag minimal={true}>g</Tag>,
      name: name,
      min: 0,
      intent: intent,
      placeholder: '0',
      //TODO: Investigate how the field can validate correctly even if the validatio is called before the value setting
      onButtonClick: () => validateField(name)
    }} />
}