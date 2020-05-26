import { useRouter } from "next/router"
import { getDataFromTree } from '@apollo/react-ssr';
import RecipeForm from "../../../components/RecipeForm";
import { useGetRecipeQuery } from "../../../graphql";
import { Spinner } from "@blueprintjs/core";
import withApollo from "../../../lib/withApollo";
import { withAuthenticated } from "../../../lib/withAuthenticated";

const EditRecipe = () => {
  const router = useRouter()

  const {
    data,
    loading,
    error
  } = useGetRecipeQuery({ variables: { id: parseInt(router.query!.id as string, 10) } })

  if (loading) return <Spinner />
  if (error) return <p>Error Loading Recipe</p>

  const recipe = data?.recipe

  return <RecipeForm recipe={recipe} onSave={() => router.push('/recipes')} />
}

export default withApollo(withAuthenticated()(EditRecipe), { getDataFromTree })