import { Button } from '@blueprintjs/core'
import { FunctionComponent } from 'react'
import DeleteButton from './DeleteButton'
import { useRouter } from 'next/router'
import { RecipeFieldsFragment } from '../graphql'
import { Box, Flex } from 'reflexbox/styled-components'

interface Props {
  recipe: RecipeFieldsFragment
}

const RecipeDetail: FunctionComponent<Props> = ({ recipe }) => {
  const router = useRouter()

  return (
    <>
      {recipe &&
        <div>
          <h1>{recipe.name}</h1>
          {recipe.ingredients.length > 0 && <ul>
            {recipe.ingredients.map(ingredient => {
              return <li key={ingredient.id}>{ingredient.name} / {ingredient.weight} / {ingredient.type} / {ingredient.group}</li>
            })}
          </ul>}

          <Flex>
            <Box mr={2}>
              <Button icon="edit" onClick={() => router.push(`/recipes/${recipe.id}/edit`)} />
            </Box>

            <Box>
              <DeleteButton recipeId={recipe.id} redirect={true} />
            </Box>
          </Flex>
        </div>}
    </>
  )
}

export default RecipeDetail