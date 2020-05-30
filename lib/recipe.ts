import { RecipeFieldsFragment, IngredientType, IngredientGroup } from "../graphql"
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

export function recipeWeightInG(recipe: RecipeFieldsFragment) {
  return recipe.ingredients
    .reduce((memo, i) => memo += i.weight, 0)
}

export function starterIngredients(recipe: RecipeFieldsFragment) {
  return recipe.ingredients.filter(i => i.group === IngredientGroup.starter)
}

export function doughIngredients(recipe: RecipeFieldsFragment) {
  return recipe.ingredients.filter(i => i.group === IngredientGroup.dough)
}

export function nameRequiredForType(type: IngredientType) {
  return [IngredientType.flour, IngredientType.other].includes(type)
}

export const uniqueIngredientTypes = [IngredientType.water, IngredientType.yeast, IngredientType.salt]