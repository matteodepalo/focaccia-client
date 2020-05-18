import { IngredientGroup, IngredientType } from "../graphql"

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

export function labelForIngredientGroup(group: IngredientGroup) {
  return ingredientGroups.find((g) => g.value === group)?.label
}

export function labelForIngredientType(type: IngredientType) {
  return ingredientTypes.find((t) => t.value === type)?.label
}