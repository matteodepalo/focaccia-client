import { withApollo } from '../lib/apollo'
import RecipeList from '../components/RecipeList'
import Layout from '../components/Layout'

const Home = () => {
  return (
    <Layout>
      <RecipeList/>
    </Layout>
  )
}

export default withApollo({ ssr: true })(Home)