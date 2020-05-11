import { Recipe, useRemoveRecipeMutation, GetRecipesQuery, GetRecipesDocument } from "../graphql"
import { FunctionComponent } from "react"
import { Spinner, Icon } from "@blueprintjs/core"
import styled from "styled-components"

interface Props {
  recipeId: Recipe['id']
}

const Button = styled.span`
  cursor: pointer;
`

const iconSize = 16

const DeleteButton: FunctionComponent<Props> = ({ recipeId }) => {
  const [removeRecipe, { loading }] = useRemoveRecipeMutation()

  const handleRemoveClick = () => {
    removeRecipe({
      variables: { id: recipeId },
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
    <Button>
      {loading ?
        <Spinner intent="danger" size={iconSize} />
      : <Icon intent="danger" icon="trash" onClick={handleRemoveClick} iconSize={iconSize} />}
    </Button>
  )
}

export default DeleteButton