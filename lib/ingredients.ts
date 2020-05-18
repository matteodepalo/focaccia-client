import { IngredientGroup, IngredientType } from "../graphql"

const ingredientGroupLabels = [
  {
    label: 'Starter',
    value: IngredientGroup.starter
  },
  {
    label: 'Dough',
    value: IngredientGroup.dough
  }
]

const ingredientTypeLabels = [
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

export function labelForIngredientGroup(group: string) {
  return ingredientGroupLabels.find((label) => label.value === group)?.label
}

export function labelForIngredientType(type: string) {
  return ingredientTypeLabels.find((label) => label.value === type)?.label
}