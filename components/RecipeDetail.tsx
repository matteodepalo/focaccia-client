import gql from 'graphql-tag'
import { Recipe, useGetRecipeQuery } from '../graphql'
import { Spinner } from '@blueprintjs/core'

gql`
  query getRecipe($id: Int!) {
    recipe(id: $id) {
      id
      name
    }
  }
`

const RecipeDetail = ({ id }: { id: number }) => {
  const {
    data,
    loading,
    error
  } = useGetRecipeQuery({ variables: { id: id }})

  let recipe: Pick<Recipe, "id" | "name"> | null = null

  if (loading) return <Spinner />
  if (error) return <p>Error Loading Recipe</p>
  if (data) recipe = data.recipe

  return (
    <p>{recipe?.name}</p>
  )
}

export default RecipeDetail