import RecipeForm from 'components/form/RecipeForm'
import { withAuth } from 'lib/withAuth'
import { getDataFromTree } from '@apollo/react-ssr';
import withApollo from 'lib/withApollo'

const NewRecipe = () => {
  return (
    <RecipeForm />
  )
}

export default withApollo(withAuth()(NewRecipe), { getDataFromTree })