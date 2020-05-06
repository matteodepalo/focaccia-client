import { NextPage, NextPageContext } from "next"
import { User, useFetchUser, CurrentUser } from "./user"
import auth0 from "./auth0"
import Layout from "../components/Layout"

export interface Props {
  user?: User | null
}

export const withAuthenticated = ({ required = true, ssr = true } = {}) => <P extends object>(PageComponent: NextPage<P>): NextPage<P & Props> => {
  const WithAuthenticated = ({ user, ...pageProps }: P & Props) => {
    let currentUser;
    let fetchUser;

    if (user) {
      // Cache the user in the client after the first render
      CurrentUser.set(user)
      currentUser = user
    } else {
      // If the user is logged out or the page is not rendered in the server
      // try to fetch the user client side and redirect when required
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

  if (ssr || PageComponent.getInitialProps) {
    WithAuthenticated.getInitialProps = async (ctx: NextPageContext) => {
      const { res, req } = ctx

      let pageProps = {} as P

      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx)
      }

      if (req && res) {
        const session = await auth0.getSession(req)

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
  }

  return WithAuthenticated
}