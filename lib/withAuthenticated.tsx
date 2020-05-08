import { NextPage, NextPageContext } from "next"
import { User, useFetchUser, CurrentUser } from "./user"
import Layout from "../components/Layout"
import { setCookie, destroyCookie } from "nookies"

export interface Props {
  user?: User | null
}

export const withAuthenticated = ({ required = true } = {}) => <P extends object>(PageComponent: NextPage<P>): NextPage<P & Props> => {
  const WithAuthenticated = ({ user, ...pageProps }: P & Props) => {
    let currentUser;
    let fetchUser;

    if (user) {
      // Cache the user in the client after the first server side render
      CurrentUser.set(user)
      currentUser = user
    } else {
      // If the user is logged out try to fetch it and redirect when required
      fetchUser = useFetchUser({ required: required })
      currentUser = fetchUser.user
    }

    return (
      <Layout user={currentUser} loading={!!fetchUser?.loading}>
        <PageComponent {...pageProps as P} />
      </Layout>
    )
  }

   // Set the correct displayName in development
   if (process.env.NODE_ENV !== 'production') {
    const displayName =
      PageComponent.displayName || PageComponent.name || 'Component'
    WithAuthenticated.displayName = `withAuthenticated(${displayName})`
  }

  WithAuthenticated.getInitialProps = async (ctx: NextPageContext) => {
    const { res, req } = ctx

    let pageProps = {} as P

    if (PageComponent.getInitialProps) {
      pageProps = await PageComponent.getInitialProps(ctx)
    }

    if (req && res && typeof window === 'undefined') {
      const { default: auth0 } = await import('./auth0')
      const session = await auth0.getSession(req)

      if(session?.accessToken) {
        setCookie(ctx, 'accessToken', session!.accessToken!, { path: '/' })
      } else {
        destroyCookie(ctx, 'accessToken')
      }

      if (required && (!session || !session.user)) {
        res.writeHead(302, {
          Location: '/api/login',
        })
        res.end()
        return { ...pageProps, user: null } as P & Props
      } else {
        return { ...pageProps, user: session?.user ?? null } as P & Props
      }
    } else {
      return { ...pageProps } as P & Props
    }
  }

  return WithAuthenticated
}