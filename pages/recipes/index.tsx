import { withApollo } from '../../lib/apollo'
import RecipeList from '../../components/RecipeList'
import { withAuthenticated } from '../../lib/authenticated'

const Recipes = () => {
  return (
    <RecipeList/>
  )
}

export default withAuthenticated()(withApollo()(Recipes))