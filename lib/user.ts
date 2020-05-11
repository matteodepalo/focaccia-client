import fetch from 'isomorphic-unfetch'
import { IClaims } from '@auth0/nextjs-auth0/dist/session/session'

export type User = IClaims

declare global {
  interface Window {
    __user?: User
  }
}

export class CurrentUser {
  static get() {
    if (typeof window !== 'undefined' && window.__user) {
      return window.__user
    } else {
      return null
    }
  }

  static set(user: User) {
    if (typeof window !== 'undefined') {
      window.__user = user
    }
  }

  static delete() {
    if (typeof window !== 'undefined') {
      delete window.__user
    }
  }
}

export async function fetchUser(cookie = ''): Promise<User | null> {
  if (CurrentUser.get()) {
    return CurrentUser.get()
  }

  const res = await fetch(
    '/api/me',
    cookie
      ? {
          headers: {
            cookie,
          },
        }
      : {}
  )

  if (!res.ok) {
    CurrentUser.delete()
    return null
  }

  const json = await res.json()
  CurrentUser.set(json)
  return json as User
}