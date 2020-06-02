import { FunctionComponent } from "react"
import { Flex } from "rebass/styled-components"
import { round } from "lodash"
import { NumericInput } from "./NumericInput"
import { IngredientInput } from "../graphql"
import { ingredientsWeightInG, ingredientsHydration } from "../lib/ingredients"
import { safeDivide } from "../lib/utils"

interface Props {
  ingredients: IngredientInput[]
  onWeightScaleFactorChange: (weight: number) => void
  onHydrationScaleFactorChange: (hydration: number) => void
}

const Totals: FunctionComponent<Props> = ({ ingredients, onWeightScaleFactorChange, onHydrationScaleFactorChange }) => {
  const totalWeight = ingredientsWeightInG(ingredients) || ingredients.length
  const totalHydration = ingredientsHydration(ingredients)

  const weightChange = (weight: number) => {
    onWeightScaleFactorChange(safeDivide(weight, totalWeight))
  }

  const hydrationChange = (hydration: number) => {
    onHydrationScaleFactorChange(safeDivide(hydration, totalHydration))
  }

  return (
    <>
      <Flex as="h3" mb={2} alignItems="center">
        Recipe for ~
        {
          <NumericInput
            boxProps={{ marginX: 2, width: 100 }}
            inputProps={{
              value: round((totalWeight / 1000) * 2) / 2,
              onValueChange: (value: number) => weightChange(value * 1000),
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
              value: totalHydration,
              onValueChange: (value: number) => hydrationChange(value)
            }}/>
        }
        %
      </Flex>
    </>
  )
}

export default Totals