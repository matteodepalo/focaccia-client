import { H1, H2, H3, HTMLTable, Dialog, Classes, ButtonGroup, InputGroup } from '@blueprintjs/core'
import { FunctionComponent, useState } from 'react'
import { useRouter } from 'next/router'
import { RecipeFieldsFragment, IngredientGroup, IngredientFieldsFragment } from 'lib/graphql'
import { Box } from 'rebass/styled-components'
import { ingredientTypeIcon, starterIngredients as filterStarterIngredients, doughIngredients as filterDoughIngredients } from 'lib/ingredients'
import Ingredient from './Ingredient'
import { round, lowerCase } from 'lodash'
import Totals from 'components/form/Totals'
import { secondsToHours, secondsToMinutes } from 'lib/utils'
import { Button } from 'components/base/Button'
import CopyToClipboard from 'react-copy-to-clipboard'
import { recipeShareUrl } from 'lib/url-helpers'
import { icon } from 'lib/icons'
import i18n from 'i18n'

interface Props {
  recipe: RecipeFieldsFragment,
  shared?: boolean
}

const RecipeDetail: FunctionComponent<Props> = ({ recipe, shared }) => {
  const router = useRouter()

  const [ingredients, setIngredients] = useState(recipe.ingredients)
  const starterIngredients = filterStarterIngredients(ingredients)
  const doughIngredients = filterDoughIngredients(ingredients)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const ingredientItem = (ingredient: IngredientFieldsFragment) => {
    return <Ingredient
      name={ingredient.name ?? lowerCase(t(ingredient.type))}
      weight={`${round(ingredient.weight)} g`}
      icon={ingredientTypeIcon(ingredient.type, { size: 25, style: { marginRight: 15 } })} />
  }

  const [t] = i18n.useTranslation()

  return (
    <>
      {recipe &&
        <div>
          <Box mb={4}>
            <H1>{recipe.name}</H1>
          </Box>

          <Totals
            starterIngredients={starterIngredients}
            doughIngredients={doughIngredients}
            onTotalsChange={({ starterIngredients, doughIngredients }) => {
              setIngredients(starterIngredients.concat(doughIngredients))
            }} />

          <Box mt={4}>
            <H2>{t('ingredients')}</H2>
          </Box>

          {starterIngredients.length > 0 &&
            <Box mt={4}>
              <H3>{t(IngredientGroup.starter)}</H3>

              <Box mt={3}>
                {starterIngredients.map((ingredient, index) => {
                  return <div key={index}>
                    {ingredientItem(ingredient)}
                  </div>
                })}
              </Box>
            </Box>
          }

          {doughIngredients.length > 0 &&
            <Box mt={4}>
              <H3>{t(IngredientGroup.dough)}</H3>

              <Box mt={3}>
                {doughIngredients.map((ingredient, index) => {
                  return <div key={index}>
                    {ingredientItem(ingredient)}
                  </div>
                })}
              </Box>
            </Box>
          }

          <Box mt={4}>
            <H2>{t('steps')}</H2>
          </Box>

          <Box mt={4}>
            <HTMLTable striped={true}>
              <tbody>
                {recipe.steps.length > 0 && (
                  recipe.steps.sort((a, b) => a.position - b.position).map((step) => (
                    <tr key={step.position}>
                      <td>{step.description}</td>
                      <td>{step.duration &&
                        <span>
                          {secondsToHours(step.duration)}
                          <sub>h</sub>
                          &nbsp;
                          {secondsToMinutes(step.duration)}
                          <sub>m</sub>
                        </span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </HTMLTable>
          </Box>

          {!shared &&
            <Box mt={4}>
              <ButtonGroup vertical={true}>
                <Button icon={icon("edit")} onClick={() => router.push('/recipes/[id]/edit', `/recipes/${recipe.id}/edit`)}>
                  {t('edit')}
                </Button>

                <Button icon={icon("share")} intent="primary" onClick={() => setIsDialogOpen(true)}>
                  {t('share')}
                </Button>
              </ButtonGroup>

              <Dialog
                icon={icon("share")}
                onClose={() => setIsDialogOpen(false)}
                title={t('share-title', { name: recipe.name })}
                isOpen={isDialogOpen}
              >
                <div className={Classes.DIALOG_BODY}>
                  <InputGroup readOnly={true} value={recipeShareUrl(recipe.token)}></InputGroup>
                </div>

                <div className={Classes.DIALOG_FOOTER}>
                  <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button onClick={() => setIsDialogOpen(false)}>{t('close')}</Button>
                    <CopyToClipboard text={recipeShareUrl(recipe.token)} onCopy={() => setIsDialogOpen(false)}>
                      <Button icon={icon("share")}>{t('copy')}</Button>
                    </CopyToClipboard>
                  </div>
                </div>
              </Dialog>
            </Box>}
        </div>}
    </>
  )
}

export default RecipeDetail
