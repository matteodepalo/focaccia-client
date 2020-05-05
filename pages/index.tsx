import { withApollo } from '../lib/apollo'
import Layout from '../components/Layout'
import { NonIdealState } from '@blueprintjs/core'
import { withAuthenticated } from '../lib/authenticated'

const Home = () => {
  return (
    <Layout>
      <NonIdealState
        title="Welcome to Focaccia" />
    </Layout>
  )
}

export default withAuthenticated()(withApollo({ ssr: true })(Home))