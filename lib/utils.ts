export function safeDivide(a: number, b: number) {
  let result: number

  if (b === 0) {
    result = 0
  } else {
    result = a / b
  }

  return result
}

export function secondsToHours(seconds: number) {
  return Math.floor(seconds / 3600)
}

export function secondsToMinutes(seconds: number) {
  return Math.floor((seconds % 3600) / 60)
}

export function hoursToSeconds(hours: number) {
  return hours * 60 * 60
}

export function minutesToSeconds(minutes: number) {
  return minutes * 60
}