import { RecipeFieldsFragment, IngredientGroup } from "../graphql"

export function starterIngredients(recipe: RecipeFieldsFragment) {
  return recipe.ingredients.filter(i => i.group === IngredientGroup.starter)
}

export function doughIngredients(recipe: RecipeFieldsFragment) {
  return recipe.ingredients.filter(i => i.group === IngredientGroup.dough)
}