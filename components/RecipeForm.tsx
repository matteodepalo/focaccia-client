import { useCreateRecipeMutation, GetRecipesQuery, GetRecipesDocument, CreateRecipeMutationVariables, CreateRecipeInput } from '../graphql'
import { Button, FormGroup, InputGroup } from '@blueprintjs/core'
import styled from 'styled-components'
import { Formik, Form as FormikForm, Field } from 'formik'
import { FunctionComponent } from 'react'
import * as Yup from 'yup';

const CreateRecipeSchema = Yup.object().shape({
  name: Yup.string().required('Required')
});

interface Props {
  onSave: () => void
}

const Form = styled(FormikForm)`
  margin-top: 50px;
  width: 360px;
`

const RecipeForm: FunctionComponent<Props> = ({ onSave }) => {
  const [createRecipeMutation] = useCreateRecipeMutation()

  const createRecipe = async (data: CreateRecipeMutationVariables['data']) => {
    await createRecipeMutation({
      variables: { data },
      update: (cache, { data }) => {
        try {
          const getExistingRecipes = cache.readQuery<GetRecipesQuery>({
            query: GetRecipesDocument
          })

          const existingRecipes = getExistingRecipes?.recipes
          const newRecipe = data?.createRecipe

          if (existingRecipes) {
            cache.writeQuery({
              query: GetRecipesDocument,
              data: {
                recipes: [newRecipe, ...existingRecipes]
              }
            })
          }
        } catch {}
      }
    })
  }

  return (
    <Formik<CreateRecipeInput>
      initialValues={{ name: '', ingredients: [] }}
      validationSchema={CreateRecipeSchema}
      onSubmit={async (values) => {
        const input = {
          name: values.name,
          ingredients: values.ingredients
        }

        await createRecipe(input)
        onSave()
      }}>
      {({ values, isSubmitting }) => (
        <Form>
          <FormGroup
            label="Name"
            labelFor="name"
            labelInfo="(required)">
            <Field as={InputGroup} name="name" />
          </FormGroup>

          <Button intent="primary" type="submit" loading={isSubmitting} disabled={isSubmitting || !CreateRecipeSchema.isValidSync(values)}>Save</Button>
        </Form>
      )}
    </Formik>
  )
}

export default RecipeForm