import { useCreateRecipeMutation, GetRecipesQuery, GetRecipesDocument, CreateRecipeMutationVariables, CreateRecipeInput } from '../graphql'
import { Button, FormGroup, InputGroup, ControlGroup, HTMLSelect, NumericInput } from '@blueprintjs/core'
import styled from 'styled-components'
import { Formik, Form as FormikForm, Field, FieldProps } from 'formik'
import { FunctionComponent } from 'react'
import { yeasts } from '../lib/yeast'
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
      initialValues={{ name: '' }}
      validationSchema={CreateRecipeSchema}
      onSubmit={async (values) => {
        const input = {
          name: values.name
        }

        if (values.yeastType) Object.assign(input, { yeastType: values.yeastType })
        if (values.yeastWeight) Object.assign(input, { yeastWeight: values.yeastWeight })

        await createRecipe(input)
        onSave()
      }}>
      {({ values, isSubmitting, setFieldValue }) => (
        <Form>
          <FormGroup
            label="Name"
            labelFor="name"
            labelInfo="(required)">
            <Field as={InputGroup} name="name" />
          </FormGroup>

          <FormGroup
            label="Yeast"
            labelFor="yeast">
            <ControlGroup fill={true}>
              <Field name="yeastType">
                {({ field }: FieldProps<CreateRecipeInput['yeastType']>) => (
                  <HTMLSelect
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    name={field.name}>
                      <option value="">Choose a type...</option>
                      {yeasts.map((yeast, index) => <option key={index} value={yeast.value}>{yeast.label}</option>)}
                  </HTMLSelect>
                )}
              </Field>

              <Field name="yeastWeight">
                {({ field }: FieldProps<CreateRecipeInput['yeastWeight']>) => (
                  <NumericInput value={field.value ?? undefined} onValueChange={handleNumericInputChange(setFieldValue)} name={field.name} />
                )}
              </Field>
            </ControlGroup>
          </FormGroup>

          <Button intent="primary" type="submit" loading={isSubmitting} disabled={isSubmitting || !CreateRecipeSchema.isValidSync(values)}>Save</Button>
        </Form>
      )}
    </Formik>
  )
}

export default RecipeForm