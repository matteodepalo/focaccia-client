import gql from 'graphql-tag'
import { useCreateRecipeMutation, GetRecipesQuery, GetRecipesDocument } from '../graphql'
import { FormEvent, useState, ChangeEvent } from 'react'
import { Button, FormGroup, InputGroup } from '@blueprintjs/core'
import styled from 'styled-components'

gql`
  mutation createRecipe($title: String!, $description: String!) {
    createRecipe(data: { title: $title, description: $description }) {
      id
      title
      description
    }
  }
`

type InputValue = string | null

const Form = styled.form`
  margin-top: 50px;
`

const RecipeForm = () => {
  const [title, setTitle] = useState<InputValue>(null)
  const [description, setDescription] = useState<InputValue>(null)
  const [createRecipe, { loading }] = useCreateRecipeMutation()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.target as HTMLFormElement
    form.reset()
    setTitle(null)
    setDescription(null)

    if (title && description) {
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
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup
        label="Title"
        labelFor="title"
        labelInfo="(required)"
        inline={true}
      >
        <InputGroup
          id="title"
          onChange={
            (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value.length > 0 ? e.target.value : null)
          } />
      </FormGroup>

      <FormGroup
        label="Description"
        labelFor="description"
        labelInfo="(required)"
        inline={true}
      >
        <InputGroup
          id="description"
          onChange={
            (e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value.length > 0 ? e.target.value : null)
          } />
      </FormGroup>

      <Button intent="primary" type="submit" loading={loading} disabled={loading || title === null || description === null}>Save</Button>
    </Form>
  )
}

export default RecipeForm