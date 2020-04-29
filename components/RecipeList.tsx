import gql from 'graphql-tag'
import { useGetRecipesQuery, Recipe } from '../graphql'

gql`
  query getRecipes {
    recipes {
      id
      title
      description
    }
  }
`

export default function RecipeList() {
  const {
    data,
    loading,
    error
  } = useGetRecipesQuery()

  let recipes: Recipe[] = []

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error Loading Recipes</p>
  if (data) recipes = data.recipes

  return (
    <ul>
      {recipes.length ? recipes.map((recipe) => (
        <li key={recipe.id}>
          <div>
            <p>{recipe.title}</p>
            <p>{recipe.description}</p>
          </div>
        </li>
      )): <p>No recipes found</p>}
    </ul>
  )
}