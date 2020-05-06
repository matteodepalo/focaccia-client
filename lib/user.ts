import { useState, useEffect } from 'react'
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
      return undefined
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

export async function fetchUser(cookie = '') {
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
  return json
}

export function useFetchUser({ required } = { required: false }) {
  const [loading, setLoading] = useState(
    () => !(CurrentUser.get())
  )
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') {
      return null
    }

    return CurrentUser.get() ?? null
  })

  useEffect(
    () => {
      if (!loading && user) {
        return
      }
      setLoading(true)
      let isMounted = true

      fetchUser().then(user => {
        // Only set the user if the component is still mounted
        if (isMounted) {
          // When the user is not logged in but login is required
          if (required && !user) {
            window.location.href = '/api/login'
            return
          }
          setUser(user)
          setLoading(false)
        }
      })

      return () => {
        isMounted = false
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return { user, loading }
}