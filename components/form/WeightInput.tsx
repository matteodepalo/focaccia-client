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
  return <NumericInput
    onChange={onChange}
    validateField={validateField}
    name={name}
    value={value}
    boxProps={{ width: 120 }}
    onBlur={onBlur}
    inputProps={{
      rightElement: <Tag minimal={true}>g</Tag>,
      intent: intent
    }} />
}