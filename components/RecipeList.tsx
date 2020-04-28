import { useQuery } from '@apollo/react-hooks'
import { Recipe } from '../graphql'
import gql from 'graphql-tag'

export const GET_RECIPES = gql`
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
  } = useQuery<{ recipes: Recipe[] }>(GET_RECIPES)

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