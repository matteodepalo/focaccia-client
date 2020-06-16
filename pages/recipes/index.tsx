import withApollo from 'lib/withApollo'
import RecipeList from 'components/RecipeList'
import { withAuthenticated } from 'lib/withAuthenticated'
import { getDataFromTree } from '@apollo/react-ssr';

const Recipes = () => {
  return (
    <RecipeList/>
  )
}

export default withApollo(withAuthenticated()(Recipes), { getDataFromTree })