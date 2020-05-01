import gql from 'graphql-tag'
import { useGetRecipesQuery, Recipe } from '../graphql'
import { Classes, Spinner } from '@blueprintjs/core'
import RecipeItem from './RecipeItem'

gql`
  query getRecipes {
    recipes {
      id
      name
    }
  }
`

export default function RecipeList() {
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
    <div>
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
        </table> : <p>No recipes</p>}
    </div>
  )
}