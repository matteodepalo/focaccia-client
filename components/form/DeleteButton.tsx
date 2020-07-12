import { useRemoveRecipeMutation, GetRecipesQuery, GetRecipesDocument, RecipeFieldsFragment } from "lib/graphql"
import { FunctionComponent, useState } from "react"
import { Classes, Dialog } from "@blueprintjs/core"
import { useRouter } from "next/router"
import { Button } from "components/base/Button"
import { icon } from "lib/icons"
import i18n from "i18n"

interface Props {
  recipe: RecipeFieldsFragment
}

const DeleteButton: FunctionComponent<Props> = ({ recipe }) => {
  const [removeRecipe, { loading }] = useRemoveRecipeMutation()
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [t] = i18n.useTranslation()

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
      <Button icon={icon("trash")} intent="danger" onClick={() => setIsDialogOpen(true)}>
        {t('delete')}
      </Button>

      <Dialog
        icon={icon("warning")}
        onClose={() => setIsDialogOpen(false)}
        title={t('confirm-deletion')}
        isOpen={isDialogOpen}
      >
        <div className={Classes.DIALOG_BODY}>
          <p>{t('confirm-deletion-question', { name: recipe.name })}</p>
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={() => setIsDialogOpen(false)}>{t('cancel')}</Button>

            <Button icon={icon("trash")} loading={loading} intent="danger" onClick={handleRemoveClick}>
              {t('delete')}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default DeleteButton