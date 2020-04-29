import gql from 'graphql-tag'
import { useGetRecipesQuery, Recipe, useRemoveRecipeMutation, GetRecipesQuery, GetRecipesDocument } from '../graphql'
import { Classes, Icon, Spinner } from '@blueprintjs/core';

gql`
  query getRecipes {
    recipes {
      id
      title
      description
    }
  }

  mutation removeRecipe($id: Int!) {
    removeRecipe(id: $id) {
      id
    }
  }
`

export default function RecipeList() {
  const {
    data,
    loading,
    error
  } = useGetRecipesQuery()

  const [removeRecipe, { loading: removeLoading }] = useRemoveRecipeMutation()

  let recipes: Recipe[] = []

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error Loading Recipes</p>
  if (data) recipes = data.recipes

  const handleRemoveClick = (id: number) => {
    removeRecipe({
      variables: { id: id },
      update: (cache, { data }) => {
        const getExistingRecipes = cache.readQuery<GetRecipesQuery>({
          query: GetRecipesDocument
        })

        const existingRecipes = getExistingRecipes?.recipes ?? []
        const removeRecipeId = data?.removeRecipe.id

        cache.writeQuery({
          query: GetRecipesDocument,
          data: {
            recipes: existingRecipes.filter((recipe) => recipe.id !== removeRecipeId)
          }
        })
      }
    })
  }

  return (
    <div>
      {recipes.length > 0 ?
        <table className={Classes.HTML_TABLE}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe) => (
            <tr key={recipe.id}>
              <td>{recipe.title}</td>
              <td>{recipe.description}</td>
              <td className="delete">
                {removeLoading ?
                  <Spinner intent="danger" size={16} />
                : <Icon intent="danger" icon="trash" onClick={() => handleRemoveClick(recipe.id) } />}
              </td>
            </tr>
          ))}

        </tbody>

        <style jsx>{`
          .delete {
            cursor: pointer;
          }
        `}</style>
      </table> : <p>No recipes</p>}
    </div>
  )
}