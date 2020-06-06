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
  let water = findDoughIngredient(doughIngredients, IngredientType.water)
  let flour = findDoughIngredient(doughIngredients, IngredientType.flour)

  return [
    water,
    flour,
    ...without(doughIngredients, water, flour)
  ]
}

function findDoughIngredient<T extends BaseIngredient, S extends IngredientType>(ingredients: T[], type: S) {
  for (let ingredient of ingredients) {
    if (ingredient.type === type) {
      return ingredient as Ingredient<T, S>
    }
  }

  throw new Error(`Ingredient of type ${type} not found`)
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

export function ingredientTypeIcon(type: IngredientType, props?: IconProps) {
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
      throw new Error(`No icon for type ${type}`)
  }
}

export function ingredientsWeightInG<T extends BaseIngredient>(ingredients: Ingredient<T>[]) {
  return ingredients.reduce((memo, i) => memo += i.weight, 0)
}

function flours<T extends BaseIngredient>(ingredients: Ingredient<T>[]) {
  return ingredients.filter(i => i.type === IngredientType.flour)
}

function flourWeight<T extends BaseIngredient>(ingredients: Ingredient<T>[]) {
  return flours(ingredients).reduce((memo, i) => memo += i.weight, 0)
}

function water<T extends BaseIngredient>(ingredients: Ingredient<T>[]) {
  return ingredients.filter(i => i.type === IngredientType.water)
}

function waterWeight<T extends BaseIngredient>(ingredients: Ingredient<T>[]) {
  return water(ingredients).reduce((memo, i) => memo += i.weight, 0)
}

export function ingredientsHydration<T extends BaseIngredient>(ingredients: Ingredient<T>[]) {
  return safeDivide(waterWeight(ingredients), flourWeight(ingredients)) * 100
}

export function flourList<T extends BaseIngredient>(ingredients: Ingredient<T>[]) {
  return uniq(flours(ingredients)).map(i => i.name)
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