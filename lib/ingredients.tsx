import { IngredientGroup, IngredientType, IngredientInput } from "../graphql"
import { GiWheat, GiBubbles, GiWaterDrop, GiSaltShaker, GiCoolSpices } from 'react-icons/gi'
import { CSSProperties } from "react"
import { uniq } from "lodash"
import { safeDivide } from "./utils"

const ingredientGroups = [
  {
    label: 'Starter',
    value: IngredientGroup.starter
  },
  {
    label: 'Dough',
    value: IngredientGroup.dough
  }
]

export const ingredientTypes = [
  {
    label: 'Flour',
    value: IngredientType.flour
  },
  {
    label: 'Yeast',
    value: IngredientType.yeast
  },
  {
    label: 'Water',
    value: IngredientType.water
  },
  {
    label: 'Salt',
    value: IngredientType.salt
  },
  {
    label: 'Other',
    value: IngredientType.other
  }
]

export function nameRequiredForType(type: IngredientType) {
  return [IngredientType.flour, IngredientType.other].includes(type)
}

export function labelForIngredientGroup(group: IngredientGroup) {
  return ingredientGroups.find((g) => g.value === group)?.label
}

export function labelForIngredientType(type: IngredientType) {
  return ingredientTypes.find((t) => t.value === type)?.label
}

export function doughIngredientRequired(ingredient: IngredientInput, doughIngredients: IngredientInput[]) {
  switch (ingredient.type) {
    case IngredientType.flour:
      return doughIngredients.filter(i => i.type === IngredientType.flour).indexOf(ingredient) === 0
    case IngredientType.water:
      return doughIngredients.map(i => i.type).includes(ingredient.type)
    default:
      return false
  }
}

const uniqueIngredientTypes = [IngredientType.water, IngredientType.yeast, IngredientType.salt]

export function ingredientTypeUnavailable(type: IngredientType, ingredients: IngredientInput[]) {
  return uniqueIngredientTypes.includes(type) && ingredients.map(i => i.type).includes(type)
}

type IconProps = {
  size: number
  style: CSSProperties
}

export const ingredientTypeIcon = (type: IngredientType, props?: IconProps)  => {
  switch (type) {
    case IngredientType.yeast:
      return <GiBubbles color="brown" {...props} />
    case IngredientType.flour:
      return <GiWheat color="brown" {...props} />
    case IngredientType.water:
      return <GiWaterDrop color="teal" {...props} />
    case IngredientType.salt:
      return <GiSaltShaker {...props} />
    case IngredientType.other:
      return <GiCoolSpices {...props} />
    default:
      throw "No icon for type"
  }
}

export function ingredientsWeightInG(ingredients: IngredientInput[]) {
  return ingredients
    .reduce((memo, i) => memo += i.weight, 0)
}

export function ingredientsHydration(ingredients: IngredientInput[]) {
  const flourWeight = ingredients.filter(i => i.type === IngredientType.flour)
    .reduce((memo, i) => memo += i.weight, 0)

  const waterWeight = ingredients.filter(i => i.type === IngredientType.water)
    .reduce((memo, i) => memo += i.weight, 0)

  return Math.floor(safeDivide(waterWeight, flourWeight) * 100)
}

export function flourList(ingredients: IngredientInput[]) {
  return uniq(ingredients.filter(i => i.type === IngredientType.flour)
    .map(i => i.name))
}

export function isDoughWater(ingredient: IngredientInput) {
  return ingredient.type === IngredientType.water && ingredient.group === IngredientGroup.dough
}