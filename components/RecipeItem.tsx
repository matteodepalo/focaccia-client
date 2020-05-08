import gql from 'graphql-tag'
import { useRemoveRecipeMutation, GetRecipesQuery, GetRecipesDocument, Recipe } from '../graphql'
import { Icon, Spinner } from '@blueprintjs/core'
import styled from 'styled-components'
import { FunctionComponent } from 'react'
import Link from 'next/link'

gql`
  mutation removeRecipe($id: Int!) {
    removeRecipe(id: $id) {
      id
    }
  }
`

interface Props {
  recipe: Pick<Recipe, "id" | "name">
}

const DeleteButton = styled.span`
  cursor: pointer;
`

const iconSize = 16

const RecipeItem: FunctionComponent<Props> = ({ recipe }) => {
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
      <td><Link href={`/recipes/${recipe.id}`}>{recipe.name}</Link></td>
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

export default RecipeItem