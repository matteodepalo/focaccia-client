import { IngredientGroup, IngredientType } from "../graphql"
import { GiWheat, GiBubbles, GiWaterDrop, GiSaltShaker, GiCoolSpices } from 'react-icons/gi'

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

const ingredientTypes = [
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

export const uniqueIngredientTypes = [IngredientType.water, IngredientType.yeast, IngredientType.salt]

export const selectableIngredientTypes = ingredientTypes.filter(i => {
  return !uniqueIngredientTypes.includes(i.value)
})

type IconStyle = {
  size: number
  style: {
    marginRight: number
  }
}

export const ingredientTypeIcon = (type: IngredientType, style?: IconStyle)  => {
  switch (type) {
    case IngredientType.yeast:
      return <GiBubbles color="brown" {...style} />
    case IngredientType.flour:
      return <GiWheat color="brown" {...style} />
    case IngredientType.water:
      return <GiWaterDrop color="teal" {...style} />
    case IngredientType.salt:
      return <GiSaltShaker {...style} />
    case IngredientType.other:
      return <GiCoolSpices {...style} />
    default:
      throw "No icon for type"
  }
}