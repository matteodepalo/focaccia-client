export function safeDivide(a: number, b: number) {
  let result: number

  if (b === 0) {
    result = 0
  } else {
    result = a / b
  }

  return result
}
