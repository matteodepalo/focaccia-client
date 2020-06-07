import { NumericInput as BPNumericInput } from '@blueprintjs/core'
import { FunctionComponent } from "react"
import { Box, BoxProps } from "rebass/styled-components"
import { lte } from 'lodash'
import { FormikHelpers, FieldProps } from 'formik'

interface Props {
  name?: string
  value: number
  onChange: (value: number) => void
  onBlur?: FieldProps<number>['field']['onBlur']
  validateField?: FormikHelpers<any>['validateField']
  boxProps?: BoxProps
  inputProps: BPNumericInput['props']
}


export const NumericInput: FunctionComponent<Props> = ({ value, name, onChange, onBlur, validateField, boxProps, inputProps }) => {
  const handleNumericInputChange = (valueAsNumber: number, valueAsString: string) => {
    if (!isNaN(valueAsNumber) && valueAsString.length > 0) {
      onChange(valueAsNumber)
    } else {
      onChange(0)
    }

    name && validateField?.(name)
  }

  return (
    <Box sx={{ touchAction: 'manipulation' }} {...boxProps}>
      <BPNumericInput
        {...inputProps}
        name={name}
        allowNumericCharactersOnly={true}
        fill={true}
        onValueChange={handleNumericInputChange}
        onBlur={onBlur}
        min={inputProps.min ?? 0}
        value={lte(value, 0) ? undefined : value}
        placeholder='0'/>
    </Box>
  )
}