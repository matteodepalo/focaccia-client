import { withApollo } from '../../lib/apollo'
import RecipeForm from '../../components/RecipeForm'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'

const NewRecipe = () => {
  const router = useRouter()

  return (
    <Layout>
      <RecipeForm onSave={() => router.push('/')}/>
    </Layout>
  )
}

export default withApollo({ ssr: true })(NewRecipe)