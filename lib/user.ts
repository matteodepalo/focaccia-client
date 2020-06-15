export interface User {
  sub: string,
  nickname: string
}

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