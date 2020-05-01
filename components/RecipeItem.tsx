import gql from 'graphql-tag'
import { useRemoveRecipeMutation, GetRecipesQuery, GetRecipesDocument, Recipe } from '../graphql'
import { Icon, Spinner } from '@blueprintjs/core'
import styled from 'styled-components'

gql`
  mutation removeRecipe($id: Int!) {
    removeRecipe(id: $id) {
      id
    }
  }
`

const DeleteButton = styled.span`
  cursor: pointer;
`

const iconSize = 16

export default function RecipeItem({ recipe }: { recipe: Pick<Recipe, "id" | "name"> }) {
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
      <td>{recipe.name}</td>
      <td>
        <DeleteButton>
          {loading ?
            <Spinner intent="danger" size={iconSize} />
          : <Icon intent="danger" icon="trash" onClick={handleRemoveClick} iconSize={iconSize} />}
        </DeleteButton>
      </td>
    </tr>
  )
}