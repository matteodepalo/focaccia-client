import { useGetRecipeQuery, GetRecipeQueryVariables } from '../graphql'
import { Spinner, Card, Elevation } from '@blueprintjs/core'
import { FunctionComponent } from 'react'
import DeleteButton from './DeleteButton'
import styled from 'styled-components'

interface Props {
  id: GetRecipeQueryVariables['id']
}

const RecipeCard = styled(Card)`
  width: 300px;
`

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
        <RecipeCard elevation={Elevation.TWO}>
          <h2>{recipe.name}</h2>
          {recipe.ingredients.length > 0 && <ul>
            {recipe.ingredients.map(ingredient => {
              return <li key={ingredient.id}>{ingredient.name} / {ingredient.weight} / {ingredient.type} / {ingredient.group}</li>
            })}
          </ul>}

          <DeleteButton recipeId={recipe.id} redirect={true} />
        </RecipeCard>}
    </>
  )
}

export default RecipeDetail