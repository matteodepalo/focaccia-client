import { withApollo } from '../../lib/apollo'
import RecipeForm from '../../components/RecipeForm'
import { useRouter } from 'next/router'
import { withAuthenticated } from '../../lib/authenticated'

const NewRecipe = () => {
  const router = useRouter()
  return (
    <RecipeForm onSave={() => router.push('/recipes')}/>
  )
}

export default withAuthenticated({ required: true })(withApollo({ ssr: true })(NewRecipe))