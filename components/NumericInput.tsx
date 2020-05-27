import { NumericInput as BPNumericInput } from '@blueprintjs/core'
import { FunctionComponent } from "react"
import { Box, BoxProps } from "rebass/styled-components"

interface Props {
  boxProps?: BoxProps
  inputProps: BPNumericInput['props']
}


export const NumericInput: FunctionComponent<Props> = ({ boxProps, inputProps }) => {
  return (
    <Box sx={{ touchAction: 'manipulation' }} {...boxProps}>
      <BPNumericInput
        allowNumericCharactersOnly={true}
        fill={true}
        {...inputProps} />
    </Box>
  )
}