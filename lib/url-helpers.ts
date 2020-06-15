import config from "./config";

export function recipeShareUrl(token: string) {
  return `${config.HOST}/r/${token}`
}