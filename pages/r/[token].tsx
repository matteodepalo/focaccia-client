import RecipeDetail from "../../components/RecipeDetail"
import { useRouter } from "next/router"
import withApollo from "../../lib/withApollo"
import { withAuthenticated } from "../../lib/withAuthenticated"
import { getDataFromTree } from '@apollo/react-ssr';
import { useGetRecipeQuery } from "../../graphql";
import { Spinner } from "@blueprintjs/core";

const SharedRecipe = () => {
  const router = useRouter()

  const {
    data,
    loading,
    error
  } = useGetRecipeQuery({ variables: { token: router.query!.token as string } })

  if (loading) return <Spinner />
  if (error) return <p>Error Loading Recipe</p>

  const recipe = data?.recipe

  return recipe ? <RecipeDetail recipe={recipe} shared={true} /> : null
}

export default withApollo(withAuthenticated({ required: false })(SharedRecipe), { getDataFromTree })