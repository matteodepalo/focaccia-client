import { RecipeFieldsFragment, IngredientType } from "../graphql"
import { uniq } from 'lodash'

export function recipeHydration(recipe: RecipeFieldsFragment) {
  const flourWeight = recipe.ingredients.filter(i => i.type === IngredientType.flour)
    .reduce((memo, i) => memo += i.weight, 0)

  const waterWeight = recipe.ingredients.filter(i => i.type === IngredientType.water)
    .reduce((memo, i) => memo += i.weight, 0)

  return Math.floor((waterWeight/flourWeight) * 100)
}

export function recipeFlourList(recipe: RecipeFieldsFragment) {
  return uniq(recipe.ingredients.filter(i => i.type === IngredientType.flour)
    .map(i => i.name))
}

export function recipeWeight(_recipe: RecipeFieldsFragment) {
  return 1
}