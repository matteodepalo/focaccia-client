export function recipeShareUrl(token: string) {
  return `${process.env.NEXT_PUBLIC_HOST}/r/${token}`
}

export default function createLoginUrl(locale: string, redirectTo?: string) {
  if (redirectTo) {
    return `/api/login?redirectTo=${encodeURIComponent(redirectTo)}&ui_locales=${locale}`;
  }
  return `/api/login?redirectTo=${encodeURIComponent('/recipes')}&ui_locales=${locale}`;
}