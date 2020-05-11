import { RecipeFieldsFragment } from '../graphql'
import { Card, Elevation } from '@blueprintjs/core'
import { FunctionComponent } from 'react'
import Link from 'next/link'
import DeleteButton from './DeleteButton'

interface Props {
  recipe: RecipeFieldsFragment
}

const RecipeItem: FunctionComponent<Props> = ({ recipe }) => {
  return (
    <Card elevation={Elevation.TWO}>
      <h2><Link href={`/recipes/${recipe.id}`}>{recipe.name}</Link></h2>
      <p>
        Yeast Type: {recipe.yeastType}<br/>
        Yeast Weight: {recipe.yeastWeight}<br/>
      </p>

      <DeleteButton recipeId={recipe.id} />
    </Card>
  )
}

export default RecipeItem