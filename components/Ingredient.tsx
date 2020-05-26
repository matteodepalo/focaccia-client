import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { Flex } from 'reflexbox/styled-components'
import { Icon, IconName } from '@blueprintjs/core'

interface Props {
  icon: IconName
  text: string
  color: string
}

const Wrapper = styled(Flex)`
  padding: 10px 0
`

const IngredientIcon = styled(Icon)`
  margin-right: 15px
`

const Ingredient: FunctionComponent<Props> = ({ text, icon, color }) => {
  return (
    <Wrapper alignItems="center">
      <IngredientIcon icon={icon} color={color} />
      <div>{text}</div>
    </Wrapper>
  )
}

export default Ingredient