import { Tag } from '@blueprintjs/core'
import { FunctionComponent } from "react"
import { NumericInput } from './NumericInput'
import { FieldProps, FormikHelpers } from 'formik'

interface Props {
  value: number
  setFieldValue: FormikHelpers<any>['setFieldValue']
  name: string
  onBlur: FieldProps<number>['field']['onBlur']
}

const handleNumericInputChange = (setFieldValue: FormikHelpers<any>['setFieldValue'], name: string) => (valueAsNumber: number, valueAsString: string) => {
  if (!isNaN(valueAsNumber) && valueAsString.length > 0) {
    setFieldValue(name, valueAsNumber)
  } else {
    setFieldValue(name, undefined)
  }
}

export const WeightInput: FunctionComponent<Props> = ({ value, setFieldValue, name, onBlur }) => {
  return <NumericInput
    boxProps={{ width: 120 }}
    inputProps={{
      allowNumericCharactersOnly: true,
      value: value,
      onBlur: onBlur,
      onValueChange: handleNumericInputChange(setFieldValue, name),
      rightElement: <Tag minimal={true}>g</Tag>,
      name: name
    }} />
}