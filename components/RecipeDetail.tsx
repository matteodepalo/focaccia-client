import { useGetRecipeQuery, GetRecipeQueryVariables } from '../graphql'
import { Spinner, Card, Elevation } from '@blueprintjs/core'
import { FunctionComponent } from 'react'
import DeleteButton from './DeleteButton'
import { labelForYeast } from '../lib/yeast'

interface Props {
  id: GetRecipeQueryVariables['id']
}

const RecipeDetail: FunctionComponent<Props> = ({ id }) => {
  const {
    data,
    loading,
    error
  } = useGetRecipeQuery({ variables: { id: id } })

  if (loading) return <Spinner />
  if (error) return <p>Error Loading Recipe</p>

  const recipe = data?.recipe

  return (
    <>
      {recipe &&
        <Card elevation={Elevation.TWO}>
          <h2>{recipe.name}</h2>
          {recipe.yeastType && typeof recipe.yeastWeight !== 'undefined' &&
            <p>
              Yeast Type: {labelForYeast(recipe.yeastType)}<br/>
              Yeast Weight: {recipe.yeastWeight}<br/>
            </p>
          }
          <DeleteButton recipeId={recipe.id} />
        </Card>}
    </>
  )
}

export default RecipeDetail