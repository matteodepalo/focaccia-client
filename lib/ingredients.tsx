import { IngredientGroup, IngredientType, IngredientInput } from "lib/graphql"
import { uniq } from "lodash"
import { safeDivide } from "./utils"
import { icon, IconProps } from "./icons"

export type BaseIngredient = Partial<IngredientInput> & Pick<IngredientInput, "type" | "group">

export type Ingredient<T extends BaseIngredient, S extends IngredientType = IngredientType> = T & {
  type: S
}

export function starterIngredients<T extends BaseIngredient>(ingredients: T[]): T[] {
  return ingredients.filter(i => i.group === IngredientGroup.starter)
}

export function doughIngredients<T extends BaseIngredient>(ingredients: T[]): T[] {
  return ingredients.filter(i => i.group === IngredientGroup.dough)
}

type IngredientGroupLabelObject<T extends IngredientGroup> = {
  label: string,
  value: T
}

type IngredientTypeLabelObject<T extends IngredientType> = {
  label: string,
  value: T
}

const ingredientGroupsWithLabels: [
  IngredientGroupLabelObject<IngredientGroup.starter>,
  IngredientGroupLabelObject<IngredientGroup.dough>,
] = [
  {
    label: 'Starter',
    value: IngredientGroup.starter
  },
  {
    label: 'Dough',
    value: IngredientGroup.dough
  }
]

export const ingredientTypesWithLabels: [
  IngredientTypeLabelObject<IngredientType.flour>,
  IngredientTypeLabelObject<IngredientType.yeast>,
  IngredientTypeLabelObject<IngredientType.water>,
  IngredientTypeLabelObject<IngredientType.salt>,
  IngredientTypeLabelObject<IngredientType.other>,
] = [
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
  for (let ingredient of ingredientGroupsWithLabels) {
    if (ingredient.value === group) {
      return ingredient.label
    }
  }

  throw new Error(`Label for group ${group} not found`)
}

export function labelForIngredientType(type: IngredientType) {
  for (let ingredient of ingredientTypesWithLabels) {
    if (ingredient.value === type) {
      return ingredient.label
    }
  }

  throw new Error(`Label for type ${type} not found`)
}

const uniqueIngredientTypes = [IngredientType.water, IngredientType.yeast, IngredientType.salt]

export function ingredientTypeUnavailable<T extends BaseIngredient>(type: IngredientType, ingredients: Ingredient<T>[]) {
  return uniqueIngredientTypes.includes(type) && ingredients.map(i => i.type).includes(type)
}

export function ingredientTypeIcon(type: IngredientType, props?: IconProps) {
  switch (type) {
    case IngredientType.yeast:
      return icon("yeast", props)
    case IngredientType.flour:
      return icon("flour", props)
    case IngredientType.water:
      return icon("water", props)
    case IngredientType.salt:
      return icon("salt", props)
    case IngredientType.other:
      return icon("misc", props)
    default:
      throw new Error(`No icon for type ${type}`)
  }
}

export function ingredientsWeightInG<T extends BaseIngredient>(ingredients: Ingredient<T>[]) {
  return ingredients.reduce((memo, i) => memo += i.weight ?? 0, 0)
}

function flours<T extends BaseIngredient>(ingredients: Ingredient<T>[]) {
  return ingredients.filter(i => i.type === IngredientType.flour)
}

function flourWeight<T extends BaseIngredient>(ingredients: Ingredient<T>[]) {
  return flours(ingredients).reduce((memo, i) => memo += i.weight ?? 0, 0)
}

export function water<T extends BaseIngredient>(ingredients: Ingredient<T>[]) {
  return ingredients.filter(i => i.type === IngredientType.water)
}

function waterWeight<T extends BaseIngredient>(ingredients: Ingredient<T>[]) {
  return water(ingredients).reduce((memo, i) => memo += i.weight ?? 0, 0)
}

export function ingredientsHydration<T extends BaseIngredient>(ingredients: Ingredient<T>[]) {
  return safeDivide(waterWeight(ingredients), flourWeight(ingredients)) * 100
}

export function flourList<T extends BaseIngredient>(ingredients: Ingredient<T>[]) {
  return uniq(flours(ingredients).map(i => i.name))
}

export function isDoughWater<T extends BaseIngredient>(ingredient: Ingredient<T>) {
  return ingredient.type === IngredientType.water && ingredient.group === IngredientGroup.dough
}

export function ingredientsByGroup<T extends BaseIngredient>(ingredients: Ingredient<T>[]) {
  return {
    starterIngredients: starterIngredients(ingredients),
    doughIngredients: doughIngredients(ingredients)
  }
}

export function doughWaterWeightForHydration<T extends BaseIngredient>(hydration: number, ingredients: Ingredient<T>[]) {
  return ((hydration * flourWeight(ingredients)) / 100) - (waterWeight(ingredients.filter((i) => !isDoughWater(i))))
}