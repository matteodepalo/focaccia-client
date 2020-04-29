import gql from 'graphql-tag'
import { useCreateRecipeMutation, GetRecipesQuery, GetRecipesDocument } from '../graphql'
import { FormEvent, useState, ChangeEvent } from 'react'
import { Button, FormGroup, InputGroup } from '@blueprintjs/core'

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
    setTitle('')
    setDescription('')

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
      <FormGroup
        label="Title"
        labelFor="title"
        inline={true}
      >
        <InputGroup id="title" onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
      </FormGroup>

      <FormGroup
        label="Description"
        labelFor="description"
        inline={true}
      >
        <InputGroup id="description" onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} />
      </FormGroup>

      <Button intent="primary" type="submit" disabled={loading}>Save</Button>
    </form>
  )
}

export default RecipeForm