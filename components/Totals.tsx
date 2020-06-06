import { Flex } from "rebass/styled-components"
import { round } from "lodash"
import { NumericInput } from "./NumericInput"
import { ingredientsWeightInG, ingredientsHydration, BaseIngredient } from "../lib/ingredients"
import { safeDivide } from "../lib/utils"


const Totals = <T extends BaseIngredient>({ ingredients, onWeightScaleFactorChange, onHydrationScaleFactorChange }: {
  ingredients: T[],
  onWeightScaleFactorChange: (weight: number) => void
  onHydrationScaleFactorChange: (hydration: number) => void
}) => {
  const originalWeight = ingredientsWeightInG(ingredients) || ingredients.length
  const originalHydration = ingredientsHydration(ingredients)

  const weightChange = (weight: number) => {
    onWeightScaleFactorChange(safeDivide(weight, originalWeight))
  }

  const hydrationChange = (hydration: number) => {
    onHydrationScaleFactorChange(safeDivide(hydration, originalHydration))
  }

  return (
    <>
      <Flex as="h3" mb={2} alignItems="center">
        Recipe for ~
        {
          <NumericInput
            boxProps={{ marginX: 2, width: 100 }}
            inputProps={{
              value: round(originalWeight / 1000, 1),
              onValueChange: (value: number) => weightChange(value * 1000),
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
              value: originalHydration,
              onValueChange: (value: number) => hydrationChange(value)
            }}/>
        }
        %
      </Flex>
    </>
  )
}

export default Totals