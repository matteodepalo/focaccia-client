import gql from 'graphql-tag'
import { useGetRecipesQuery, Recipe } from '../graphql'
import { Classes, Spinner, NonIdealState, AnchorButton } from '@blueprintjs/core'
import RecipeItem from './RecipeItem'
import { Box } from 'reflexbox/styled-components'
import Link from 'next/link'

gql`
  query getRecipes {
    recipes {
      id
      name
    }
  }
`

const EmptyList = () => {
  return (
    <NonIdealState
      icon="document"
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

  let recipes: Pick<Recipe, "id" | "name">[] = []

  if (loading) return <Spinner />
  if (error) return <p>Error Loading Recipes</p>
  if (data) recipes = data.recipes

  return (
    <Box>
      {recipes.length > 0 ?
        <table className={Classes.HTML_TABLE}>
          <thead>
            <tr>
              <th>Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => (
              <RecipeItem recipe={recipe} key={recipe.id} />
            ))}
          </tbody>
        </table> : <EmptyList />}
    </Box>
  )
}

export default RecipeList