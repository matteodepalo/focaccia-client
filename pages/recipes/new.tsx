import RecipeForm from '../../components/form/RecipeForm'
import { useRouter } from 'next/router'
import { withAuthenticated } from '../../lib/withAuthenticated'
import { getDataFromTree } from '@apollo/react-ssr';
import withApollo from '../../lib/withApollo'

const NewRecipe = () => {
  const router = useRouter()

  return (
    <RecipeForm onSave={() => router.push('/recipes')}/>
  )
}

export default withApollo(withAuthenticated()(NewRecipe), { getDataFromTree })