import { NumericInput as BPNumericInput } from '@blueprintjs/core'
import { FunctionComponent } from "react"
import { Box, BoxProps } from "rebass/styled-components"
import { lte } from 'lodash'

interface Props {
  boxProps?: BoxProps
  inputProps: BPNumericInput['props']
}


export const NumericInput: FunctionComponent<Props> = ({ boxProps, inputProps }) => {
  return (
    <Box sx={{ touchAction: 'manipulation' }} {...boxProps}>
      <BPNumericInput
        {...inputProps}
        allowNumericCharactersOnly={true}
        fill={true}
        min={inputProps.min ?? 0}
        value={lte(inputProps.value, 0) ? undefined : inputProps.value}
        placeholder='0'/>
    </Box>
  )
}