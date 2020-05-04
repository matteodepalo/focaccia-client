import { withApollo } from '../lib/apollo'
import Layout from '../components/Layout'
import { useFetchUser } from '../lib/user'
import { NonIdealState } from '@blueprintjs/core'

const Home = () => {
  const { user, loading } = useFetchUser()

  return (
    <Layout user={user} loading={loading}>
      <NonIdealState
        title="Welcome to Focaccia" />
    </Layout>
  )
}

export default withApollo()(Home)