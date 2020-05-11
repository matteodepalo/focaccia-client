import { RecipeFieldsFragment } from '../graphql'
import { Card, Elevation } from '@blueprintjs/core'
import { FunctionComponent } from 'react'
import Link from 'next/link'
import DeleteButton from './DeleteButton'
import { labelForYeast } from '../lib/yeast'
import styled from 'styled-components'

interface Props {
  recipe: RecipeFieldsFragment
}

const RecipeCard = styled(Card)`
  margin-bottom: 15px;
`

const RecipeItem: FunctionComponent<Props> = ({ recipe }) => {
  return (
    <RecipeCard elevation={Elevation.TWO}>
      <h2><Link href={`/recipes/${recipe.id}`}><a>{recipe.name}</a></Link></h2>
      {recipe.yeastType && typeof recipe.yeastWeight !== 'undefined' &&
        <p>
          Yeast Type: {labelForYeast(recipe.yeastType)}<br/>
          Yeast Weight: {recipe.yeastWeight}<br/>
        </p>
      }
      <DeleteButton recipeId={recipe.id} />
    </RecipeCard>
  )
}

export default RecipeItem