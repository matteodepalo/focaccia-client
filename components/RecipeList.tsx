import { useGetRecipesQuery } from 'lib/graphql'
import { Spinner, NonIdealState, AnchorButton } from '@blueprintjs/core'
import RecipeItem from './RecipeItem'
import Link from 'next/link'
import { icon } from 'lib/icons'

const EmptyList = () => {
  return (
    <NonIdealState
      icon={icon("recipe")}
      title="You have no saved recipes"
      description="Create a new recipe"
      action={<Link href="/recipes/new"><AnchorButton intent="primary" text="Create"/></Link>} />
  )
}

const RecipeList = () => {
  const {
    data,
    loading,
    error
  } = useGetRecipesQuery()

  if (loading) return <Spinner />
  if (error) return <p>Error Loading Recipes</p>

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