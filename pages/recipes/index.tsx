import withApollo from 'lib/withApollo'
import RecipeList from 'components/RecipeList'
import { withAuth } from 'lib/withAuth'
import { getDataFromTree } from '@apollo/react-ssr';

const Recipes = () => {
  return (
    <RecipeList/>
  )
}

export default withApollo(withAuth()(Recipes), { getDataFromTree })