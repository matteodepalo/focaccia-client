export function recipeShareUrl(token: string) {
  return `${process.env.NEXT_PUBLIC_HOST}/r/${token}`
}

export default function createLoginUrl(locale: string, redirectTo?: string) {
  return `/api/login?redirectTo=${encodeURIComponent(redirectTo ?? '/recipes')}&ui_locales=${locale}`;
}