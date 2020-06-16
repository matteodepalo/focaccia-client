export function recipeShareUrl(token: string) {
  return `${process.env.NEXT_PUBLIC_HOST}/r/${token}`
}

export default function createLoginUrl(redirectTo?: string) {
  if (redirectTo) {
    return `/api/login?redirectTo=${encodeURIComponent(redirectTo)}`;
  }
  return `/api/login`;
}