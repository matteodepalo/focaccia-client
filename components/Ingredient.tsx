import { FunctionComponent } from 'react'
import { Flex } from 'rebass/styled-components'

interface Props {
  icon: JSX.Element
  text: string
}

const Ingredient: FunctionComponent<Props> = ({ text, icon }) => {
  return (
    <Flex paddingY={2} alignItems="center">
      {icon}
      <div>{text}</div>
    </Flex>
  )
}

export default Ingredient