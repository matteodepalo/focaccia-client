import { Flex } from "rebass/styled-components"
import { round } from "lodash"
import { NumericInput } from "./NumericInput"
import { ingredientsWeightInG, ingredientsHydration, BaseIngredient, DoughIngredients, isDoughWater, groupByGroup, doughWaterWeightFromHydration } from "../lib/ingredients"
import { safeDivide } from "../lib/utils"
import { useState } from "react"

const Totals = <T extends BaseIngredient>({ starterIngredients, doughIngredients, onIngredientsChange }: {
  starterIngredients: T[],
  doughIngredients: DoughIngredients<T>
  onIngredientsChange: ({ starterIngredients, doughIngredients }: { starterIngredients: T[], doughIngredients: DoughIngredients<T>}) => void
}) => {
  const ingredients = starterIngredients.concat(doughIngredients)
  const [totalWeight, setTotalWeight] = useState(ingredientsWeightInG(ingredients))
  const [hydration, setHydration] = useState(ingredientsHydration(ingredients))

  const totalWeightChange = (newTotalWeight: number) => {
    const scaleFactor = safeDivide(newTotalWeight, totalWeight)

    const updatedIngredientWeight = (ingredientWeight: number) => {
      if (totalWeight === 0) {
        return newTotalWeight / ingredients.length
      } else {
        return round(ingredientWeight * scaleFactor)
      }
    }

    const updatedIngredients = ingredients.map((ingredient) => {
      return {
        ...ingredient,
        weight: updatedIngredientWeight(ingredient.weight)
      }
    })

    setTotalWeight(newTotalWeight)
    onIngredientsChange(groupByGroup(updatedIngredients))
  }

  const hydrationChange = (newHydration: number) => {
    const scaleFactor = safeDivide(newHydration, hydration)

    const updatedDoughWaterWeight = (doughWaterWeight: number) => {
      if (hydration === 0) {
        return doughWaterWeightFromHydration(newHydration, ingredients)
      } else {
        return round(doughWaterWeight * scaleFactor)
      }
    }

    const updatedIngredients = ingredients.map((ingredient) => {
      if (isDoughWater(ingredient)) {
        return {
          ...ingredient,
          weight: updatedDoughWaterWeight(ingredient.weight)
        }
      } else {
        return ingredient
      }
    })

    setHydration(newHydration)
    onIngredientsChange(groupByGroup(updatedIngredients))
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
              stepSize: 0.1,
              min: 0
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
              onValueChange: (value: number) => hydrationChange(value),
              min: 0
            }}/>
        }
        %
      </Flex>
    </>
  )
}

export default Totals