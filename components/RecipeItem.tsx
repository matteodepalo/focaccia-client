import { RecipeFieldsFragment, IngredientType } from '../graphql'
import { Card, Elevation, H1 } from '@blueprintjs/core'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { useRouter } from "next/router"
import { recipeHydration, recipeFlourList } from '../lib/recipe'
import Ingredient from './Ingredient'
import { ingredientTypeIcon } from '../lib/ingredients'

interface Props {
  recipe: RecipeFieldsFragment
}

const RecipeCard = styled(Card)`
  margin-bottom: 15px;
  width: 300px;
`

const RecipeItem: FunctionComponent<Props> = ({ recipe }) => {
  const router = useRouter()

  return (
    <RecipeCard elevation={Elevation.TWO} interactive={true} onClick={() => router.push('/recipes/[id]', `/recipes/${recipe.id}`)}>
      <H1>{recipe.name}</H1>
      <div>
        <Ingredient
          text={`${recipeHydration(recipe)}%`}
          icon={ingredientTypeIcon(IngredientType.water)} />

        <Ingredient
          text={recipeFlourList(recipe).join(', ')}
          icon={ingredientTypeIcon(IngredientType.flour)} />
      </div>
    </RecipeCard>
  )
}

export default RecipeItem