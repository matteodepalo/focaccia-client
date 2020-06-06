import { Button, H1, H2, H3 } from '@blueprintjs/core'
import { FunctionComponent, useState } from 'react'
import { useRouter } from 'next/router'
import { RecipeFieldsFragment, IngredientGroup, IngredientFieldsFragment } from '../graphql'
import { Box } from 'rebass/styled-components'
import { labelForIngredientGroup, ingredientTypeIcon, labelForIngredientType, starterIngredients as filterStarterIngredients, doughIngredients as filterDoughIngredients } from '../lib/ingredients'
import Ingredient from './Ingredient'
import { round, lowerCase } from 'lodash'
import Totals from './Totals'

interface Props {
  recipe: RecipeFieldsFragment
}

const RecipeDetail: FunctionComponent<Props> = ({ recipe }) => {
  const router = useRouter()

  const [ingredients, setIngredients] = useState(recipe.ingredients)
  const starterIngredients = filterStarterIngredients(ingredients)
  const doughIngredients = filterDoughIngredients(ingredients)

  const ingredientItem = (ingredient: IngredientFieldsFragment) => {
    return <Ingredient
      text={`${round(ingredient.weight)} g of ${ingredient.name ?? lowerCase(labelForIngredientType(ingredient.type))}`}
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
            starterIngredients={starterIngredients}
            doughIngredients={doughIngredients}
            onTotalsChange={({ starterIngredients, doughIngredients }) => {
              setIngredients(starterIngredients.concat(doughIngredients))
            }} />

          <Box mt={4}>
            <H2>Ingredients</H2>
          </Box>

          {starterIngredients.length > 0 &&
            <Box mt={4}>
              <H3>{labelForIngredientGroup(IngredientGroup.starter)}</H3>

              <Box mt={3}>
                {starterIngredients.map((ingredient, index) => {
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
            {doughIngredients.map((ingredient, index) => {
              return <div key={index}>
                {ingredientItem(ingredient)}
              </div>
            })}
          </Box>
        </Box>

        <Box mt={4}>
          <Button icon="edit" onClick={() => router.push('/recipes/[id]/edit', `/recipes/${recipe.id}/edit`)}>
            Edit
          </Button>
        </Box>
      </div>}
    </>
  )
}

export default RecipeDetail