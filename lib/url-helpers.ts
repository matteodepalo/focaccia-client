import config from "./config";

export function recipeShareUrl(token: string) {
  return `${config.HOST}/r/${token}`
}

export default function createLoginUrl(redirectTo?: string) {
  if (redirectTo) {
    return `/api/login?redirectTo=${encodeURIComponent(redirectTo)}`;
  }
  return `/api/login`;
}