import { RecipeFieldsFragment } from '../graphql'
import { Card, Elevation } from '@blueprintjs/core'
import { FunctionComponent } from 'react'
import Link from 'next/link'
import DeleteButton from './DeleteButton'
import styled from 'styled-components'

interface Props {
  recipe: RecipeFieldsFragment
}

const RecipeCard = styled(Card)`
  margin-bottom: 15px;
  width: 300px;
`

const RecipeItem: FunctionComponent<Props> = ({ recipe }) => {
  return (
    <RecipeCard elevation={Elevation.TWO}>
      <h2><Link href={`/recipes/${recipe.id}`}><a>{recipe.name}</a></Link></h2>
      <DeleteButton recipeId={recipe.id} />
    </RecipeCard>
  )
}

export default RecipeItem