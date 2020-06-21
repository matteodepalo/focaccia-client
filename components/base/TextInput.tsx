import { InputGroup } from '@blueprintjs/core'
import { FunctionComponent, FocusEvent } from "react"
import { formatString } from 'lib/field-helpers'

type InputProps = InputGroup['props']
type Props = InputProps

export const TextInput: FunctionComponent<Props> = (props) => {
  return (
    <InputGroup
      {...props}
      onBlur={(event: FocusEvent<HTMLInputElement>) => {
        event.target.value = formatString(event.target.value)
        props.onChange?.(event)
        props.onBlur?.(event)
      }} />
  )
}