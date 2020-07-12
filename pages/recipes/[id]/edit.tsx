import { useRouter } from "next/router"
import { getDataFromTree } from '@apollo/react-ssr';
import RecipeForm from "components/form/RecipeForm";
import { useGetRecipeQuery } from "lib/graphql";
import { Spinner } from "@blueprintjs/core";
import withApollo from "lib/withApollo";
import { withAuth } from "lib/withAuth";
import i18n from "i18n";

const EditRecipe = () => {
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

  return <RecipeForm recipe={recipe} />
}

export default withApollo(withAuth()(EditRecipe), { getDataFromTree })