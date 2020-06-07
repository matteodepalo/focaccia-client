import { Tag, Intent } from '@blueprintjs/core'
import { FunctionComponent } from "react"
import { NumericInput } from './NumericInput'
import { FieldProps, FormikHelpers } from 'formik'

interface Props {
  value: number
  onChange: (value: number) => void
  name: string
  onBlur: FieldProps<number>['field']['onBlur']
  intent: Intent,
  validateField: FormikHelpers<any>['validateField']
}

export const WeightInput: FunctionComponent<Props> = ({ value, onChange, name, onBlur, intent, validateField }) => {
  const handleNumericInputChange = (valueAsNumber: number, valueAsString: string) => {
    if (!isNaN(valueAsNumber) && valueAsString.length > 0) {
      onChange(valueAsNumber)
    } else {
      onChange(0)
    }

    validateField(name)
  }

  return <NumericInput
    boxProps={{ width: 120 }}
    inputProps={{
      allowNumericCharactersOnly: true,
      value: value,
      onBlur: onBlur,
      onValueChange: handleNumericInputChange,
      rightElement: <Tag minimal={true}>g</Tag>,
      name: name,
      intent: intent
    }} />
}