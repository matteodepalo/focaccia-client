import { NextPage, NextPageContext } from "next"
import { User, CurrentUser } from "./user"
import Layout from "components/Layout"
import { setCookie, destroyCookie } from "nookies"
import { UserProvider } from "./UserProvider"
import createLoginUrl from "./url-helpers"

interface Props {
  user: User | null
}

export const withAuth = ({ required = true } = {}) => <P extends object>(PageComponent: NextPage<P>): NextPage<P & Props> => {
  const WithAuthenticated = ({ user, ...pageProps }: P & Props) => {
    if (user) CurrentUser.set(user)

    return (
      <UserProvider value={user}>
        <Layout>
          <PageComponent {...pageProps as P} />
        </Layout>
      </UserProvider>
    )
  }

   // Set the correct displayName in development
   if (process.env.NODE_ENV !== 'production') {
    const displayName =
      PageComponent.displayName || PageComponent.name || 'Component'
    WithAuthenticated.displayName = `withAuth(${displayName})`
  }

  WithAuthenticated.getInitialProps = async (ctx: NextPageContext) => {
    const { res, req } = ctx

    let pageProps = {} as P

    if (PageComponent.getInitialProps) {
      pageProps = await PageComponent.getInitialProps(ctx)
    }

    if (req && res && typeof window === 'undefined') {
      // Server side
      const { default: auth0 } = await import('./auth0')
      // ignore until https://github.com/auth0/nextjs-auth0/pull/113 is merged
      //@ts-ignore
      const session = await auth0.getSession(req)

      if (session && session.user && session.accessToken) {
        setCookie(ctx, 'accessToken', session.accessToken, { path: '/' })

        return { ...pageProps, user: session.user } as P & Props
      } else {
        destroyCookie(ctx, 'accessToken')

        if (required) {
          res.writeHead(302, {
            Location: createLoginUrl(req.url),
          })
          res.end()
        }

        return { ...pageProps, user: null } as P & Props
      }
    } else {
      // Client side
      return { ...pageProps, user: CurrentUser.get() } as P & Props
    }
  }

  return WithAuthenticated
}