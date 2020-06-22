import { FunctionComponent } from 'react'
import { Flex, Box, Text } from 'rebass/styled-components'

interface Props {
  icon: JSX.Element
  name: string
  weight?: string
}

const Ingredient: FunctionComponent<Props> = ({ name, weight, icon }) => {
  return (
    <Flex paddingY={2} alignItems="center">
      <Box width={25} mr={10}>
        {icon}
      </Box>
      <Text fontSize={16} fontWeight='bold' mr={10} sx={{textTransform: 'capitalize'}}>
        {name}
      </Text>
      {weight && <Text fontSize={15}>
        {weight}
      </Text>}
    </Flex>
  )
}

export default Ingredient
