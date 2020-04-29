import gql from 'graphql-tag'
import { useCreateRecipeMutation, GetRecipesQuery, GetRecipesDocument } from '../graphql'
import { FormEvent, useState } from 'react'

gql`
  mutation createRecipe($title: String, $description: String) {
    createRecipe(data: { title: $title, description: $description }) {
      id
      title
      description
    }
  }
`

const RecipeForm = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [createRecipe, { loading }] = useCreateRecipeMutation()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.target as HTMLFormElement
    form.reset()

    createRecipe({
      variables: { title, description },
      update: (cache, { data }) => {
        const getExistingRecipes = cache.readQuery<GetRecipesQuery>({
          query: GetRecipesDocument
        })

        const existingRecipes = getExistingRecipes?.recipes ?? []
        const newRecipe = data?.createRecipe

        cache.writeQuery({
          query: GetRecipesDocument,
          data: {
            recipes: [newRecipe, ...existingRecipes]
          }
        })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" name="title" onChange={e => setTitle(e.target.value)} />
      </label>

      <label>
        Description:
        <input type="text" name="description" onChange={e => setDescription(e.target.value)} />
      </label>
      <input type="submit" value="Submit" disabled={loading}/>
    </form>
  )
}

export default RecipeForm