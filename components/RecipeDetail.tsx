import { Button, IconName, NumericInput } from '@blueprintjs/core'
import { FunctionComponent, useState } from 'react'
import DeleteButton from './DeleteButton'
import { useRouter } from 'next/router'
import { RecipeFieldsFragment, IngredientGroup, IngredientType, IngredientFieldsFragment } from '../graphql'
import { Box, Flex } from 'reflexbox/styled-components'
import { labelForIngredientGroup } from '../lib/ingredients'
import { starterIngredients, doughIngredients, recipeWeightInG, recipeHydration } from '../lib/recipe'
import Ingredient from './Ingredient'
import { capitalize, round } from 'lodash'

interface Props {
  recipe: RecipeFieldsFragment
}

export const ingredientTypeIcon = (type: IngredientType): IconName => {
  switch (type) {
    case IngredientType.yeast:
      return "arrow-up"
    case IngredientType.flour:
      return "properties"
    case IngredientType.water:
      return "tint"
    case IngredientType.salt:
      return "square"
    case IngredientType.other:
      return "symbol-triangle-up"
    default:
      throw "No icon for type"
  }
}

export const ingredientTypeColor = (type: IngredientType): string => {
  switch (type) {
    case IngredientType.yeast:
      return "brown"
    case IngredientType.flour:
      return "brown"
    case IngredientType.water:
      return "blue"
    case IngredientType.salt:
      return "grey"
    case IngredientType.other:
      return "grey"
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
      icon={ingredientTypeIcon(ingredient.type)}
      color={ingredientTypeColor(ingredient.type)} />
  }

  return (
    <>
      {recipe &&
        <div>
          <h1>{recipe.name}</h1>

          <Flex as="h3" mb={2} alignItems="center">
            Recipe for
            {
              <Box marginX={2} width={100}>
                <NumericInput
                  fill={true}
                  value={round(weight / 1000, 2)}
                  onValueChange={(value: number) => setWeight(value * 1000)} />
              </Box>
            }
            kg
          </Flex>

          <Flex as="h3" alignItems="center">
            Hydration
            {
              <Box marginX={2} width={100}>
                <NumericInput
                  fill={true}
                  value={hydration}
                  onValueChange={(value: number) => setHydration(value)} />
              </Box>
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