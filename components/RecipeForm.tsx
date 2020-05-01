import gql from 'graphql-tag'
import { useCreateRecipeMutation, GetRecipesQuery, GetRecipesDocument } from '../graphql'
import { FormEvent, useState, ChangeEvent } from 'react'
import { Button, FormGroup, InputGroup } from '@blueprintjs/core'
import styled from 'styled-components'

gql`
  mutation createRecipe($name: String!) {
    createRecipe(data: { name: $name }) {
      id
      name
    }
  }
`

type InputValue = string | null

const Form = styled.form`
  margin-top: 50px;
`

const RecipeForm = () => {
  const [name, setName] = useState<InputValue>(null)
  const [createRecipe, { loading }] = useCreateRecipeMutation()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.target as HTMLFormElement
    form.reset()
    setName(null)

    if (name) {
      createRecipe({
        variables: { name },
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
        label="Name"
        labelFor="name"
        labelInfo="(required)"
        inline={true}
      >
        <InputGroup
          id="name"
          onChange={
            (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value.length > 0 ? e.target.value : null)
          } />
      </FormGroup>

      <Button intent="primary" type="submit" loading={loading} disabled={loading || name === null}>Save</Button>
    </Form>
  )
}

export default RecipeForm