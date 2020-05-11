type YeastType = 'natural' | 'dry'
type YeastLabel = 'Natural' | 'Dry'

interface Yeast {
  value: YeastType,
  label: YeastLabel
}

export const yeasts: Yeast[] = [
  {
    label: 'Natural',
    value: 'natural'
  },
  {
    label: 'Dry',
    value: 'dry'
  }
]

export function labelForYeast(type: string) {
  return yeasts.find((yeast) => yeast.value === type)?.label
}