import { useCreateRecipeMutation, GetRecipesQuery, GetRecipesDocument, CreateRecipeMutationVariables, CreateRecipeInput } from '../graphql'
import { Button, FormGroup, InputGroup, ControlGroup, HTMLSelect, NumericInput } from '@blueprintjs/core'
import styled from 'styled-components'
import { Formik, Form as FormikForm, Field, FieldProps } from 'formik'
import { FunctionComponent } from 'react'
import { yeasts } from '../lib/yeast'

interface Props {
  onSave: () => void
}

const Form = styled(FormikForm)`
  margin-top: 50px;
  width: 500px;
`

const RecipeForm: FunctionComponent<Props> = ({ onSave }) => {
  const [createRecipeMutation] = useCreateRecipeMutation()

  const createRecipe = async (data: CreateRecipeMutationVariables['data']) => {
    await createRecipeMutation({
      variables: { data },
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

  const handleNumericInputChange = (setFieldValue: Function) => (value: number) => {
    setFieldValue('yeastWeight', value)
  }

  return (
    <Formik<CreateRecipeInput>
      initialValues={{ name: '', yeastType: 'natural', yeastWeight: 0 }}
      onSubmit={async (values, actions) => {
        await createRecipe({ name: values.name, yeastType: values.yeastType, yeastWeight: values.yeastWeight })
        actions.setSubmitting(false)
        actions.resetForm()
        onSave()
      }}>
      {({ values, isSubmitting, setFieldValue }) => (
        <Form>
          <FormGroup
            label="Name"
            labelFor="name"
            labelInfo="(required)"
            inline={true}
          >
            <Field as={InputGroup} name="name" />
          </FormGroup>

          <FormGroup
            label="Yeast"
            labelFor="yeast"
            labelInfo="(required)"
            inline={true}
          >
            <ControlGroup>
              <Field name="yeastType">
                {({ field }: FieldProps<CreateRecipeInput['yeastType']>) => (
                  // yeastType initial value is set in the form so we can use !
                  <HTMLSelect
                    options={yeasts}
                    value={field.value!}
                    onChange={field.onChange}
                    name={field.name} />
                )}
              </Field>

              <Field name="yeastWeight">
                {({ field }: FieldProps<CreateRecipeInput['yeastWeight']>) => (
                  // yeastWeight initial value is set in the form so we can use !
                  <NumericInput value={field.value!} onValueChange={handleNumericInputChange(setFieldValue)} name={field.name} />
                )}
              </Field>
            </ControlGroup>
          </FormGroup>

          <Button intent="primary" type="submit" loading={isSubmitting} disabled={isSubmitting || values.name === ''}>Save</Button>
        </Form>
      )}
    </Formik>
  )
}

export default RecipeForm