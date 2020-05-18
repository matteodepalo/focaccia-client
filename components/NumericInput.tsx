import { NumericInput as BPNumericInput, Tag } from '@blueprintjs/core'
import { FunctionComponent } from "react"

interface Props {
  value: number
  setFieldValue: Function
  name: string
}

const handleNumericInputChange = (setFieldValue: Function, name: string) => (value: number) => {
  if (!isNaN(value)) {
    setFieldValue(name, value)
  }
}

export const NumericInput: FunctionComponent<Props> = ({ value, setFieldValue, name }) => {
  return <BPNumericInput
    allowNumericCharactersOnly={true}
    value={value}
    onValueChange={handleNumericInputChange(setFieldValue, name)}
    rightElement={<Tag minimal={true}>g</Tag>}
    name={name} />
}