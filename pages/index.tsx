import { withApollo } from '../lib/apollo'
import { NonIdealState } from '@blueprintjs/core'
import { withAuthenticated } from '../lib/authenticated'

const Home = () => {
  return (
    <NonIdealState
      title="Welcome to Focaccia" />
  )
}

export default withAuthenticated({ ssr: false, required: false })(withApollo({ ssr: false })(Home))