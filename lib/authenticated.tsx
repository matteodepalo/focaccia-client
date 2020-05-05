import { NextPage, GetServerSideProps } from "next"
import { useFetchUser, User } from "./user"
import Layout from "../components/Layout"
import auth0 from "./auth0"

interface Props {
  required: boolean
}

interface ServerSideProps {
  user: User | null
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async function({ req, res }) {
  // Here you can check authentication status directly before rendering the page,
  // however the page would be a serverless function, which is more expensive and
  // slower than a static page with client side authentication
  const session = await auth0.getSession(req)

  if (!session || !session.user) {
    res.writeHead(302, {
      Location: '/api/login',
    })
    res.end()
    return { props: { user: null } }
  }

  return { props: { user: session.user } }
}

export const withAuthenticated = ({ required = false, ...pageProps }: Props) => (PageComponent: NextPage) => {
  const { user, loading } = useFetchUser({ required: required })

  return (
    <Layout user={user} loading={loading}>
      <PageComponent {...pageProps} />
    </Layout>
  )
}