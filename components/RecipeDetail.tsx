import { useGetRecipeQuery, GetRecipeQueryVariables } from '../graphql'
import { Spinner, Card, Elevation } from '@blueprintjs/core'
import { FunctionComponent } from 'react'
import DeleteButton from './DeleteButton'

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
          <h5>{recipe.name}</h5>
          <p>
            Yeast Type: {recipe.yeastType}<br/>
            Yeast Weight: {recipe.yeastWeight}<br/>
          </p>

          <DeleteButton recipeId={recipe.id} />
        </Card>}
    </>
  )
}

export default RecipeDetail