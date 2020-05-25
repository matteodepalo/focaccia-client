import { RecipeFieldsFragment } from '../graphql'
import { Card, Elevation, Icon } from '@blueprintjs/core'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { Flex } from 'reflexbox'
import { useRouter } from "next/router"
import { recipeHydration, recipeFlourList } from '../lib/recipe'

interface Props {
  recipe: RecipeFieldsFragment
}

const RecipeCard = styled(Card)`
  margin-bottom: 15px;
  width: 300px;
`

const Detail = styled(Flex)`
  padding: 10px 0
`

const DetailIcon = styled(Icon)`
  margin-right: 15px
`

const RecipeItem: FunctionComponent<Props> = ({ recipe }) => {
  const router = useRouter()

  return (
    <RecipeCard elevation={Elevation.TWO} interactive={true} onClick={() => router.push(`/recipes/${recipe.id}`)}>
      <h1>{recipe.name}</h1>
      <div>
        <Detail alignItems="center">
          <DetailIcon icon="tint" intent="primary" />
          <div>{recipeHydration(recipe)}%</div>
        </Detail>

        <Detail alignItems="center">
          <DetailIcon icon="properties" intent="warning" />
          <div>{recipeFlourList(recipe).join(', ')}</div>
        </Detail>
      </div>
    </RecipeCard>
  )
}

export default RecipeItem