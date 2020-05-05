import { NextPage, NextPageContext } from "next"
import { User } from "./user"
import auth0 from "./auth0"
import App, { AppContext } from "next/app"
import UserContext from "../contexts/userContext"

export interface Props {
  user: User | null
}

function inAppContext(ctx: any): ctx is AppContext {
  return "ctx" in ctx
}

export const withAuthenticated = () => (PageComponent: NextPage) => {
  const WithAuthenticated = ({ user, ...pageProps }: Props) => {
    return (
      <UserContext.Provider value={user}>
        <PageComponent {...pageProps} />
      </UserContext.Provider>
    )
  }

  WithAuthenticated.getInitialProps = async (ctx: NextPageContext) => {
    const { res, req } = ctx

    let pageProps = {}

    if (PageComponent.getInitialProps && !inAppContext(ctx)) {
      pageProps = await PageComponent.getInitialProps(ctx)
    } else if (inAppContext(ctx)) {
      pageProps = await App.getInitialProps(ctx)
    }

    if (!req || !res) {
      return { ...pageProps, user: null }
    } else {
      const session = await auth0.getSession(req)

      if (!session || !session.user) {
        res.writeHead(302, {
          Location: '/api/login',
        })
        res.end()
        return { ...pageProps, user: null }
      }

      return { ...pageProps, user: session.user }
    }
  }

  return WithAuthenticated
}