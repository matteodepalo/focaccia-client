import { useGetRecipesQuery } from 'lib/graphql'
import { Spinner, NonIdealState, AnchorButton } from '@blueprintjs/core'
import RecipeItem from './RecipeItem'
import Link from 'next/link'
import { icon } from 'lib/icons'
import i18n from 'i18n'

const EmptyList = () => {
  const [t] = i18n.useTranslation()

  return (
    <NonIdealState
      icon={icon("recipe")}
      title={t('recipes-empty-state.title')}
      description={t('recipes-empty-state.description') as string}
      action={<Link href="/recipes/new"><AnchorButton intent="primary" text={t('add')}/></Link>} />
  )
}

const RecipeList = () => {
  const {
    data,
    loading,
    error
  } = useGetRecipesQuery()

  const [t] = i18n.useTranslation()

  if (loading) return <Spinner />
  if (error) return <p>{t('recipes-error')}</p>

  const recipes = data?.recipes

  return (
    <>
      {recipes && recipes.length > 0 ?
        recipes.map((recipe) => (
          <RecipeItem recipe={recipe} key={recipe.id} />
        )) : <EmptyList />}
    </>
  )
}

export default RecipeList