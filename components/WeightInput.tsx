import { Tag } from '@blueprintjs/core'
import { FunctionComponent } from "react"
import { NumericInput } from './NumericInput'

interface Props {
  value: number
  setFieldValue: Function
  name: string
}

const handleNumericInputChange = (setFieldValue: Function, name: string) => (valueAsNumber: number, valueAsString: string) => {
  if (!isNaN(valueAsNumber) && valueAsString.length > 0) {
    setFieldValue(name, valueAsNumber)
  } else {
    setFieldValue(name, undefined)
  }
}

export const WeightInput: FunctionComponent<Props> = ({ value, setFieldValue, name }) => {
  return <NumericInput
    boxProps={{ width: 120 }}
    inputProps={{
      allowNumericCharactersOnly: true,
      value: value,
      onValueChange: handleNumericInputChange(setFieldValue, name),
      rightElement: <Tag minimal={true}>g</Tag>,
      name: name
    }} />
}