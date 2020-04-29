import gql from 'graphql-tag'
import { useRemoveRecipeMutation, GetRecipesQuery, GetRecipesDocument, Recipe } from '../graphql'
import { Icon, Spinner } from '@blueprintjs/core';

gql`
  mutation removeRecipe($id: Int!) {
    removeRecipe(id: $id) {
      id
    }
  }
`

export default function RecipeItem({ recipe }: { recipe: Recipe }) {
  const [removeRecipe, { loading }] = useRemoveRecipeMutation()

  const handleRemoveClick = () => {
    removeRecipe({
      variables: { id: recipe.id },
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
    <tr>
      <td>{recipe.title}</td>
      <td>{recipe.description}</td>
      <td className="delete">
        {loading ?
          <Spinner intent="danger" size={16} />
        : <Icon intent="danger" icon="trash" onClick={handleRemoveClick} />}
      </td>

      <style jsx>{`
        .delete {
          cursor: pointer;
        }
      `}</style>
    </tr>
  )
}