import { capitalize, trim } from "lodash"

export function wrapNullableValue<T>(value: T | null | undefined) {
  if (value === null) {
    return undefined
  } else {
    return value
  }
}

export function formatString(value: string | null | undefined) {
  return value ? capitalize(trim(value)) : ''
}