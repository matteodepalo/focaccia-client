import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { Flex } from 'reflexbox/styled-components'
import { Icon, IconName } from '@blueprintjs/core'

interface Props {
  icon: IconName
  text: string
  color: string
}

const IngredientIcon = styled(Icon)`
  margin-right: 15px
`

const Ingredient: FunctionComponent<Props> = ({ text, icon, color }) => {
  return (
    <Flex paddingY={2} alignItems="center">
      <IngredientIcon icon={icon} color={color} />
      <div>{text}</div>
    </Flex>
  )
}

export default Ingredient