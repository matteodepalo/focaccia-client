import RecipeDetail from "components/RecipeDetail"
import { useRouter } from "next/router"
import withApollo from "lib/withApollo"
import { withAuth } from "lib/withAuth"
import { getDataFromTree } from '@apollo/react-ssr';
import { useGetRecipeQuery } from "lib/graphql";
import { Spinner } from "@blueprintjs/core";
import i18n from "i18n";

const Recipe = () => {
  const router = useRouter()

  const {
    data,
    loading,
    error
  } = useGetRecipeQuery({ variables: { id: parseInt(router.query!.id as string, 10) } })

  const [t] = i18n.useTranslation()

  if (loading) return <Spinner />
  if (error) return <p>{t('recipes-error')}</p>

  const recipe = data?.recipe

  return recipe ? <RecipeDetail recipe={recipe} /> : null
}

export default withApollo(withAuth()(Recipe), { getDataFromTree })