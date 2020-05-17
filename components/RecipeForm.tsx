import { useCreateRecipeMutation, GetRecipesQuery, GetRecipesDocument, CreateRecipeMutationVariables, CreateRecipeInput } from '../graphql'
import { Button, EditableText } from '@blueprintjs/core'
import { Formik, Form as FormikForm, Field, FieldProps } from 'formik'
import { FunctionComponent } from 'react'
import * as Yup from 'yup';

const CreateRecipeSchema = Yup.object().shape({
  name: Yup.string().required('Required')
});

interface Props {
  onSave: () => void
}

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
      {({ values, isSubmitting, setFieldValue }) => (
        <FormikForm>
          <Field name="name">
            {({ field }: FieldProps<CreateRecipeInput['name']>) => (
              <h1>
                <EditableText
                  value={field.value}
                  onChange={(value: string) => setFieldValue('name', value)}
                  multiline={true}
                  placeholder="Edit name..." />
              </h1>
            )}
          </Field>

          <Button intent="primary" type="submit" loading={isSubmitting} disabled={isSubmitting || !CreateRecipeSchema.isValidSync(values)}>Save</Button>
        </FormikForm>
      )}
    </Formik>
  )
}

export default RecipeForm