import { RecipeFieldsFragment, IngredientType } from '../graphql'
import { Card, Elevation, H1 } from '@blueprintjs/core'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { useRouter } from "next/router"
import Ingredient from './Ingredient'
import { ingredientTypeIcon, ingredientsHydration, flourList } from '../lib/ingredients'
import { round } from 'lodash'

interface Props {
  recipe: RecipeFieldsFragment
}

const RecipeCard = styled(Card)`
  margin-bottom: 15px;
  width: 300px;
`

const RecipeItem: FunctionComponent<Props> = ({ recipe }) => {
  const router = useRouter()
  const iconProps = { size: 25, style: { marginRight: 15 } }

  return (
    <RecipeCard elevation={Elevation.TWO} interactive={true} onClick={() => router.push('/recipes/[id]', `/recipes/${recipe.id}`)}>
      <H1>{recipe.name}</H1>
      <div>
        <Ingredient
          text={`${round(ingredientsHydration(recipe.ingredients))}%`}
          icon={ingredientTypeIcon(IngredientType.water, iconProps)} />

        <Ingredient
          text={flourList(recipe.ingredients).join(', ')}
          icon={ingredientTypeIcon(IngredientType.flour, iconProps)} />
      </div>
    </RecipeCard>
  )
}

export default RecipeItem