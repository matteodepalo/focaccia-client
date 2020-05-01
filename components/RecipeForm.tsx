import gql from 'graphql-tag'
import { useCreateRecipeMutation, GetRecipesQuery, GetRecipesDocument, CreateRecipeMutationVariables } from '../graphql'
import { Button, FormGroup, InputGroup } from '@blueprintjs/core'
import styled from 'styled-components'
import { Formik, Form as FormikForm, Field } from 'formik';

gql`
  mutation createRecipe($name: String!) {
    createRecipe(data: { name: $name }) {
      id
      name
    }
  }
`

const Form = styled(FormikForm)`
  margin-top: 50px;
`

const RecipeForm = () => {
  const [createRecipeMutation] = useCreateRecipeMutation()

  const createRecipe = async ({ name }: CreateRecipeMutationVariables) => {
    await createRecipeMutation({
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

  return (
    <Formik
      initialValues={{ name: '' }}
      onSubmit={async (values, actions) => {
        await createRecipe({ name: values.name })
        actions.setSubmitting(false);
        actions.resetForm();
      }}>
      {({ values, isSubmitting }) => (
        <Form>
          <FormGroup
            label="Name"
            labelFor="name"
            labelInfo="(required)"
            inline={true}
          >
            <Field as={InputGroup} name="name" />
          </FormGroup>
          <Button intent="primary" type="submit" loading={isSubmitting} disabled={isSubmitting || values.name === ''}>Save</Button>
        </Form>
      )}
    </Formik>
  )
}

export default RecipeForm