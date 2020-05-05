import { withApollo } from '../lib/apollo'
import Layout from '../components/Layout'
import { NonIdealState } from '@blueprintjs/core'

const Home = () => {
  return (
    <Layout>
      <NonIdealState
        title="Welcome to Focaccia" />
    </Layout>
  )
}

export default withApollo({ ssr: true })(Home)