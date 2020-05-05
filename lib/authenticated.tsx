import { NextPage, NextPageContext } from "next"
import { User } from "./user"
import auth0 from "./auth0"
import UserContext from "../contexts/userContext"

export interface Props {
  user: User | null
}

export const withAuthenticated = () => <P extends object>(PageComponent: NextPage<P>): NextPage<P & Props> => {
  const WithAuthenticated = ({ user, ...pageProps }: P & Props) => {
    return (
      <UserContext.Provider value={user}>
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

    if (!req || !res) {
      return { ...pageProps, user: null } as P & Props
    } else {
      const session = await auth0.getSession(req)

      if (!session || !session.user) {
        res.writeHead(302, {
          Location: '/api/login',
        })
        res.end()
        return { ...pageProps, user: null } as P & Props
      }

      return { ...pageProps, user: session.user } as P & Props
    }
  }

  return WithAuthenticated
}