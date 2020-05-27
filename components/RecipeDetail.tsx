import { Button } from '@blueprintjs/core'
import { FunctionComponent, useState } from 'react'
import DeleteButton from './DeleteButton'
import { useRouter } from 'next/router'
import { RecipeFieldsFragment, IngredientGroup, IngredientType, IngredientFieldsFragment } from '../graphql'
import { Box, Flex } from 'rebass/styled-components'
import { labelForIngredientGroup } from '../lib/ingredients'
import { starterIngredients, doughIngredients, recipeWeightInG, recipeHydration } from '../lib/recipe'
import Ingredient from './Ingredient'
import { capitalize, round } from 'lodash'
import { NumericInput } from './NumericInput'
import { GiWheat, GiBubbles, GiWaterDrop, GiSaltShaker, GiChiliPepper } from 'react-icons/gi'

interface Props {
  recipe: RecipeFieldsFragment
}

export const ingredientTypeIcon = (type: IngredientType)  => {
  const style = { size: 25, style: { marginRight: 15 } }

  switch (type) {
    case IngredientType.yeast:
      return <GiBubbles color="brown" {...style} />
    case IngredientType.flour:
      return <GiWheat color="brown" {...style} />
    case IngredientType.water:
      return <GiWaterDrop color="blue" {...style} />
    case IngredientType.salt:
      return <GiSaltShaker color="grey" {...style} />
    case IngredientType.other:
      return <GiChiliPepper color="grey" {...style} />
    default:
      throw "No icon for type"
  }
}

const RecipeDetail: FunctionComponent<Props> = ({ recipe }) => {
  const router = useRouter()

  const recipeOriginalWeight = recipeWeightInG(recipe)
  const [weight, setWeight] = useState(recipeOriginalWeight)
  const weightScaleFactor = weight / recipeOriginalWeight

  const recipeOriginalHydration = recipeHydration(recipe)
  const [hydration, setHydration] = useState(recipeOriginalHydration)
  const hydrationScaleFactor = hydration / recipeOriginalHydration

  const ingredientItem = (ingredient: IngredientFieldsFragment) => {
    let ingredientWeight = ingredient.weight * weightScaleFactor

    if (ingredient.type === IngredientType.water && ingredient.group === IngredientGroup.dough) {
      ingredientWeight *= hydrationScaleFactor
    }

    return <Ingredient
      text={`${round(ingredientWeight)}g ${ingredient.name ?? capitalize(ingredient.type)}`}
      icon={ingredientTypeIcon(ingredient.type)} />
  }

  return (
    <>
      {recipe &&
        <div>
          <h1>{recipe.name}</h1>

          <Flex as="h3" mb={2} alignItems="center">
            Recipe for
            {
              <NumericInput
                boxProps={{ marginX: 2, width: 100 }}
                inputProps={{
                  value: round(weight / 1000, 2),
                  onValueChange: (value: number) => setWeight(value * 1000)
                }}/>
            }
            kg
          </Flex>

          <Flex as="h3" alignItems="center">
            Hydration
            {
              <NumericInput
                boxProps={{ marginX: 2, width: 100 }}
                inputProps={{
                  value: hydration,
                  onValueChange: (value: number) => setHydration(value)
                }}/>
            }
            %
          </Flex>

          <h2>Ingredients</h2>

          <h3>{labelForIngredientGroup(IngredientGroup.starter)}</h3>

          {starterIngredients(recipe).map((ingredient, index) => {
            return <div key={index}>
              {ingredientItem(ingredient)}
            </div>
          })}

          <h3>{labelForIngredientGroup(IngredientGroup.dough)}</h3>

          {doughIngredients(recipe).map((ingredient, index) => {
            return <div key={index}>
              {ingredientItem(ingredient)}
            </div>
          })}

          <Flex mt={4}>
            <Box mr={2}>
              <Button icon="edit" onClick={() => router.push(`/recipes/${recipe.id}/edit`)} />
            </Box>

            <Box>
              <DeleteButton recipeId={recipe.id} redirect={true} />
            </Box>
          </Flex>
        </div>}
    </>
  )
}

export default RecipeDetail