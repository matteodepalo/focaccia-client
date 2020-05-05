import { withApollo } from '../../lib/apollo'
import RecipeForm from '../../components/RecipeForm'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { withAuthenticated } from '../../lib/authenticated'

const NewRecipe = () => {
  const router = useRouter()

  return (
    <Layout>
      <RecipeForm onSave={() => router.push('/recipes')}/>
    </Layout>
  )
}

export default withAuthenticated({ required: true })(withApollo({ ssr: true })(NewRecipe))