import { NextPage, NextPageContext } from "next"
import { User, useFetchUser } from "./user"
import auth0 from "./auth0"
import UserContext from "../contexts/userContext"

export interface Props {
  user?: User | null
}

let currentUser: User | null

export const withAuthenticated = ({ required = false } = {}) => <P extends object>(PageComponent: NextPage<P>): NextPage<P & Props> => {
  const WithAuthenticated = ({ user, ...pageProps }: P & Props) => {
    if (typeof user !== 'undefined') {
      currentUser = user
    } else {
      currentUser = currentUser ?? useFetchUser({ required: required }).user
    }

    return (
      <UserContext.Provider value={currentUser}>
        <PageComponent {...pageProps as P} />
      </UserContext.Provider>
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

  return WithAuthenticated
}