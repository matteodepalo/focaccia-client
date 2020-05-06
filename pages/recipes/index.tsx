import { withApollo } from '../../lib/apollo'
import RecipeList from '../../components/RecipeList'
import { withAuthenticated } from '../../lib/authenticated'
import Layout from '../../components/Layout'

const Recipes = () => {
  return (
    <Layout>
      <RecipeList/>
    </Layout>
  )
}

export default withAuthenticated()(withApollo()(Recipes))