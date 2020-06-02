import { IngredientGroup, IngredientType, IngredientInput } from "../graphql"
import { GiWheat, GiBubbles, GiWaterDrop, GiSaltShaker, GiCoolSpices } from 'react-icons/gi'
import { CSSProperties } from "react"
import { uniq, without } from "lodash"
import { safeDivide } from "./utils"

export type BaseIngredient = IngredientInput

export type Ingredient<T extends BaseIngredient, S extends IngredientType = IngredientType> = T & {
  type: S
}

type Water<T extends BaseIngredient> = Ingredient<T, IngredientType.water>
type Flour<T extends BaseIngredient> = Ingredient<T, IngredientType.flour>

type DoughIngredient<T extends BaseIngredient> = Water<T> | Flour<T> | Ingredient<T>
export type DoughIngredients<T extends BaseIngredient> = [Water<T>, Flour<T>, ...T[]]

export function starterIngredients<T extends BaseIngredient>(ingredients: T[]): T[] {
  return ingredients.filter(i => i.group === IngredientGroup.starter)
}

export function doughIngredients<T extends BaseIngredient>(ingredients: T[]): DoughIngredients<T> {
  let doughIngredients = ingredients.filter(i => i.group === IngredientGroup.dough)
  let water = findIngredient(ingredients, IngredientType.water)
  let flour = findIngredient(ingredients, IngredientType.flour)

  return [
    water,
    flour,
    ...without(doughIngredients, water, flour)
  ]
}

function findIngredient<T extends BaseIngredient, S extends IngredientType>(ingredients: T[], type: S) {
  for (let ingredient of ingredients) {
    if (ingredient.type === type) {
      return ingredient as Ingredient<T, S>
    }
  }

  throw new Error(`Ingredient of type ${type} not found`)
}

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

export function doughIngredientRequired(ingredient: DoughIngredient<IngredientInput>, doughIngredients: DoughIngredients<IngredientInput>) {
  return doughIngredients[0] === ingredient || doughIngredients[1] === ingredient
}

const uniqueIngredientTypes = [IngredientType.water, IngredientType.yeast, IngredientType.salt]

export function ingredientTypeUnavailable(type: IngredientType, ingredients: Ingredient<IngredientInput>[]) {
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

export function ingredientsWeightInG<T extends BaseIngredient>(ingredients: Ingredient<T>[]) {
  return ingredients
    .reduce((memo, i) => memo += i.weight, 0)
}

export function ingredientsHydration<T extends BaseIngredient>(ingredients: Ingredient<T>[]) {
  const flourWeight = ingredients.filter(i => i.type === IngredientType.flour)
    .reduce((memo, i) => memo += i.weight, 0)

  const waterWeight = ingredients.filter(i => i.type === IngredientType.water)
    .reduce((memo, i) => memo += i.weight, 0)

  return Math.floor(safeDivide(waterWeight, flourWeight) * 100)
}

export function flourList<T extends BaseIngredient>(ingredients: Ingredient<T>[]) {
  return uniq(ingredients.filter(i => i.type === IngredientType.flour)
    .map(i => i.name))
}

export function isDoughWater<T extends BaseIngredient>(ingredient: Ingredient<T>) {
  return ingredient.type === IngredientType.water && ingredient.group === IngredientGroup.dough
}