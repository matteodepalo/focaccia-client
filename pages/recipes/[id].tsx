import RecipeDetail from "components/RecipeDetail"
import { useRouter } from "next/router"
import withApollo from "lib/withApollo"
import { withAuthenticated } from "lib/withAuthenticated"
import { getDataFromTree } from '@apollo/react-ssr';
import { useGetRecipeQuery } from "lib/graphql";
import { Spinner } from "@blueprintjs/core";

const Recipe = () => {
  const router = useRouter()

  const {
    data,
    loading,
    error
  } = useGetRecipeQuery({ variables: { id: parseInt(router.query!.id as string, 10) } })

  if (loading) return <Spinner />
  if (error) return <p>Error Loading Recipe</p>

  const recipe = data?.recipe

  return recipe ? <RecipeDetail recipe={recipe} /> : null
}

export default withApollo(withAuthenticated()(Recipe), { getDataFromTree })