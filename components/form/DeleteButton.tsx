import { useRemoveRecipeMutation, GetRecipesQuery, GetRecipesDocument, RecipeFieldsFragment } from "../../graphql"
import { FunctionComponent, useState } from "react"
import { Classes, Dialog } from "@blueprintjs/core"
import { useRouter } from "next/router"
import { Button } from "../base/Button"

interface Props {
  recipe: RecipeFieldsFragment
}

const DeleteButton: FunctionComponent<Props> = ({ recipe }) => {
  const [removeRecipe, { loading }] = useRemoveRecipeMutation()
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleRemoveClick = () => {
    removeRecipe({
      variables: { id: recipe.id },
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

        router.push('/recipes')
      }
    })
  }

  return (
    <>
      <Button fill={true} icon="trash" intent="danger" onClick={() => setIsDialogOpen(true)}>
        Delete
      </Button>

      <Dialog
        icon="warning-sign"
        onClose={() => setIsDialogOpen(false)}
        title="Confirm Deletion"
        isOpen={isDialogOpen}
      >
        <div className={Classes.DIALOG_BODY}>
          <p>Are you sure you want to delete the recipe {recipe.name}?</p>
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>

            <Button icon="trash" loading={loading} intent="danger" onClick={handleRemoveClick}>
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default DeleteButton