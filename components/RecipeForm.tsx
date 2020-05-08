import gql from 'graphql-tag'
import { useCreateRecipeMutation, GetRecipesQuery, GetRecipesDocument, CreateRecipeMutationVariables } from '../graphql'
import { Button, FormGroup, InputGroup, ControlGroup, HTMLSelect } from '@blueprintjs/core'
import styled from 'styled-components'
import { Formik, Form as FormikForm, Field, FieldProps } from 'formik'
import { FunctionComponent } from 'react'

gql`
  mutation createRecipe($name: String!) {
    createRecipe(data: { name: $name }) {
      id
      name
    }
  }
`

interface Props {
  onSave: () => void
}

const Form = styled(FormikForm)`
  margin-top: 50px;
  width: 500px;
`

type YeastType = 'natural' | 'dry'
type YeastLabel = 'Natural' | 'Dry'

interface Yeast {
  value: YeastType,
  label: YeastLabel
}

const yeasts: Yeast[] = [
  {
    label: 'Natural',
    value: 'natural'
  },
  {
    label: 'Dry',
    value: 'dry'
  }
]

const RecipeForm: FunctionComponent<Props> = ({ onSave }) => {
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

  const YeastSelect: FunctionComponent<FieldProps['field']> = (props) => {
    return <HTMLSelect
      options={yeasts}
      value={props.value}
      onChange={props.onChange}
      name={props.name} />
  }

  return (
    <Formik
      initialValues={{ name: '' }}
      onSubmit={async (values, actions) => {
        await createRecipe({ name: values.name })
        actions.setSubmitting(false);
        actions.resetForm();
        onSave()
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

          <FormGroup
            label="Yeast"
            labelFor="yeast"
            labelInfo="(required)"
            inline={true}
          >
            <ControlGroup>
              <Field as={YeastSelect} name="yeastType" />
              <Field as={InputGroup} name="yeastWeight" />
            </ControlGroup>
          </FormGroup>

          <Button intent="primary" type="submit" loading={isSubmitting} disabled={isSubmitting || values.name === ''}>Save</Button>
        </Form>
      )}
    </Formik>
  )
}

export default RecipeForm