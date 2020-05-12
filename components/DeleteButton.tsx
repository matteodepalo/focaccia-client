import { Recipe, useRemoveRecipeMutation, GetRecipesQuery, GetRecipesDocument } from "../graphql"
import { FunctionComponent } from "react"
import { Button } from "@blueprintjs/core"
import { useRouter } from "next/router"

interface Props {
  recipeId: Recipe['id'],
  redirect?: boolean
}

const DeleteButton: FunctionComponent<Props> = ({ recipeId, redirect }) => {
  const [removeRecipe, { loading }] = useRemoveRecipeMutation()
  const router = useRouter()

  const handleRemoveClick = () => {
    removeRecipe({
      variables: { id: recipeId },
      update: (cache, { data }) => {
        try {
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
        } catch {}

        if (redirect) {
          router.push('/recipes')
        }
      }
    })
  }

  return (
    <Button icon="trash" loading={loading} intent="danger" onClick={handleRemoveClick} />
  )
}

export default DeleteButton