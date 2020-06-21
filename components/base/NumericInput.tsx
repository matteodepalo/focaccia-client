import { NumericInput as BPNumericInput } from '@blueprintjs/core'
import { FunctionComponent } from "react"
import { Box, BoxProps } from "rebass/styled-components"
import { gte } from 'lodash'
import { FormikHelpers, FieldProps } from 'formik'

interface Props {
  name?: string
  value: number
  onChange: (value: number | undefined) => void
  onBlur?: FieldProps<number>['field']['onBlur']
  validateField?: FormikHelpers<any>['validateField']
  boxProps?: BoxProps
  inputProps: BPNumericInput['props']
}


export const NumericInput: FunctionComponent<Props> = ({ value, name, onChange, onBlur, validateField, boxProps, inputProps }) => {
  const handleNumericInputChange = (valueAsNumber: number, valueAsString: string) => {
    if (!isNaN(valueAsNumber) && valueAsString.length > 0 && gte(valueAsNumber, 0)) {
      onChange(valueAsNumber)
    } else {
      onChange(undefined)
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
        onFocus={(event) => {
          if (event.target.value === '0') {
            event.target.value = ''
          }
        }}
        onValueChange={handleNumericInputChange}
        onBlur={(event) => {
          if (event.target.value === '') {
            event.target.value = '0'
          }

          onBlur?.(event)
        }}
        min={inputProps.min ?? 0}
        value={value}
        placeholder='0'/>
    </Box>
  )
}