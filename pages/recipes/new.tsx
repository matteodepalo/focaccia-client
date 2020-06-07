import RecipeForm from '../../components/form/RecipeForm'
import { withAuthenticated } from '../../lib/withAuthenticated'
import { getDataFromTree } from '@apollo/react-ssr';
import withApollo from '../../lib/withApollo'

const NewRecipe = () => {
  return (
    <RecipeForm />
  )
}

export default withApollo(withAuthenticated()(NewRecipe), { getDataFromTree })