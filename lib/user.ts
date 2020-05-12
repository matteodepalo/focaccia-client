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
}