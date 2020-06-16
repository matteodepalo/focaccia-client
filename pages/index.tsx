import { NonIdealState } from '@blueprintjs/core'
import { withAuthenticated } from 'lib/withAuthenticated'

const Home = () => {
  return (
    <NonIdealState
      title="Welcome to Focaccia" />
  )
}

export default withAuthenticated({ required: false })(Home)