import { Flex } from "rebass/styled-components"
import { round } from "lodash"
import { NumericInput } from "./NumericInput"
import { ingredientsWeightInG, ingredientsHydration, BaseIngredient, DoughIngredients, isDoughWater, ingredientsByGroup, doughWaterWeightForHydration } from "../../lib/ingredients"
import { safeDivide } from "../../lib/utils"

const Totals = <T extends BaseIngredient>({ starterIngredients, doughIngredients, onTotalsChange }: {
  starterIngredients: T[],
  doughIngredients: DoughIngredients<T>
  onTotalsChange: ({ starterIngredients, doughIngredients }: { starterIngredients: T[], doughIngredients: DoughIngredients<T>}) => void
}) => {
  const ingredients = starterIngredients.concat(doughIngredients)
  const totalWeight = ingredientsWeightInG(ingredients)
  const hydration = ingredientsHydration(ingredients)
  const hydrationMinimum = ingredientsHydration(ingredients.filter((i) => !isDoughWater(i)))

  const totalWeightChange = (updatedTotalWeight: number) => {
    const updatedIngredientWeight = (ingredientWeight: number) => {
      if (totalWeight === 0) {
        return round(updatedTotalWeight / ingredients.length)
      } else {
        return round(ingredientWeight * safeDivide(updatedTotalWeight, totalWeight))
      }
    }

    const updatedIngredients = ingredients.map((ingredient) => {
      return {
        ...ingredient,
        weight: updatedIngredientWeight(ingredient.weight)
      }
    })

    onTotalsChange(ingredientsByGroup(updatedIngredients))
  }

  const hydrationChange = (updatedHydration: number) => {
    const updatedIngredients = ingredients.map((ingredient) => {
      if (isDoughWater(ingredient)) {
        return {
          ...ingredient,
          weight: round(doughWaterWeightForHydration(updatedHydration, ingredients))
        }
      } else {
        return ingredient
      }
    })

    onTotalsChange(ingredientsByGroup(updatedIngredients))
  }

  return (
    <>
      <Flex as="h3" mb={2} alignItems="center">
        Recipe for ~
        {
          <NumericInput
            boxProps={{ marginX: 2, width: 100 }}
            inputProps={{
              value: round(totalWeight / 1000, 1),
              onValueChange: (value: number) => totalWeightChange(value * 1000),
              stepSize: 0.1
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
              value: round(hydration),
              onValueChange: (value: number) => hydrationChange(value),
              min: round(hydrationMinimum)
            }}/>
        }
        %
      </Flex>
    </>
  )
}

export default Totals