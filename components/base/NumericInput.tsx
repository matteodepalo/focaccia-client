import { NumericInput as BPNumericInput } from '@blueprintjs/core'
import { FunctionComponent } from "react"
import { Box, BoxProps } from "rebass/styled-components"
import { gte } from 'lodash'
import { FormikHelpers } from 'formik'
import { wrapNullableValue } from 'lib/field-helpers'

type Props = Omit<BPNumericInput['props'], 'onChange'> & {
  onChange: (value: number | undefined) => void
  validateField?: FormikHelpers<any>['validateField']
  containerProps?: BoxProps
}


export const NumericInput: FunctionComponent<Props> = ({ value, name, onChange, validateField, containerProps, ...props }) => {
  const handleNumericInputChange = (valueAsNumber: number, valueAsString: string) => {
    if (!isNaN(valueAsNumber) && valueAsString.length > 0 && gte(valueAsNumber, 0)) {
      onChange(valueAsNumber)
    } else {
      onChange(undefined)
    }

    name && validateField?.(name)
  }

  return (
    <Box sx={{ touchAction: 'manipulation' }} {...containerProps}>
      <BPNumericInput
        {...props}
        name={name}
        allowNumericCharactersOnly={true}
        fill={true}
        onValueChange={handleNumericInputChange}
        min={props.min ?? 0}
        value={wrapNullableValue(value)}
        placeholder='0'/>
    </Box>
  )
}