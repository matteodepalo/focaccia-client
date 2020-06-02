import { Button, H1, H2, H3 } from '@blueprintjs/core'
import { FunctionComponent, useState } from 'react'
import DeleteButton from './DeleteButton'
import { useRouter } from 'next/router'
import { RecipeFieldsFragment, IngredientGroup, IngredientFieldsFragment } from '../graphql'
import { Box, Flex } from 'rebass/styled-components'
import { labelForIngredientGroup, ingredientTypeIcon, labelForIngredientType, isDoughWater } from '../lib/ingredients'
import { starterIngredients, doughIngredients } from '../lib/recipe'
import Ingredient from './Ingredient'
import { round, lowerCase } from 'lodash'
import Totals from './Totals'

interface Props {
  recipe: RecipeFieldsFragment
}

const RecipeDetail: FunctionComponent<Props> = ({ recipe }) => {
  const router = useRouter()

  const [weightScaleFactor, setWeightScaleFactor] = useState(1)
  const [hydrationScaleFactor, setHydrationScaleFactor] = useState(1)

  const ingredientItem = (ingredient: IngredientFieldsFragment) => {
    let ingredientWeight = ingredient.weight * weightScaleFactor

    if (isDoughWater(ingredient)) {
      ingredientWeight *= hydrationScaleFactor
    }

    return <Ingredient
      text={`${round(ingredientWeight)} g of ${ingredient.name ?? lowerCase(labelForIngredientType(ingredient.type))}`}
      icon={ingredientTypeIcon(ingredient.type, { size: 25, style: { marginRight: 15 } })} />
  }

  return (
    <>
      {recipe &&
        <div>
          <Box mb={4}>
            <H1>{recipe.name}</H1>
          </Box>

          <Totals
            ingredients={recipe.ingredients}
            onWeightScaleFactorChange={setWeightScaleFactor}
            onHydrationScaleFactorChange={setHydrationScaleFactor} />

          <Box mt={4}>
            <H2>Ingredients</H2>
          </Box>

          {starterIngredients(recipe).length > 0 &&
            <Box mt={4}>
              <H3>{labelForIngredientGroup(IngredientGroup.starter)}</H3>

              <Box mt={3}>
                {starterIngredients(recipe).map((ingredient, index) => {
                  return <div key={index}>
                    {ingredientItem(ingredient)}
                  </div>
                })}
              </Box>
            </Box>
          }


        <Box mt={4}>
          <H3>{labelForIngredientGroup(IngredientGroup.dough)}</H3>

          <Box mt={3}>
            {doughIngredients(recipe).map((ingredient, index) => {
              return <div key={index}>
                {ingredientItem(ingredient)}
              </div>
            })}
          </Box>
        </Box>

        <Flex mt={4}>
          <Box mr={2}>
            <Button icon="edit" onClick={() => router.push('/recipes/[id]/edit', `/recipes/${recipe.id}/edit`)} />
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