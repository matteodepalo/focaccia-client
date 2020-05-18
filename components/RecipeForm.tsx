import { useCreateRecipeMutation, GetRecipesQuery, GetRecipesDocument, CreateRecipeMutationVariables, IngredientGroup, IngredientType, IngredientInput } from '../graphql'
import { Button, EditableText, ControlGroup } from '@blueprintjs/core'
import { Formik, Form as FormikForm, Field, FieldProps, FieldArray } from 'formik'
import { FunctionComponent } from 'react'
import * as Yup from 'yup';
import { labelForIngredientGroup } from '../lib/ingredients';
import { IngredientField } from './IngredientField';

const CreateRecipeSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  starterIngredients: Yup.array()
    .of(
      Yup.object().shape({
        weight: Yup.number().moreThan(0)
      })
    ),
  doughIngredients: Yup.array()
    .of(
      Yup.object().shape({
        weight: Yup.number().moreThan(0)
      })
    )
    .required('Must have doughIngredients')
});

interface Props {
  onSave: () => void
}

interface FormValues {
  name: string,
  starterIngredients: IngredientInput[],
  doughIngredients: IngredientInput[]
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
    <Formik<FormValues>
      initialValues={{ name: '', starterIngredients: [], doughIngredients: [] }}
      validationSchema={CreateRecipeSchema}
      onSubmit={async (values) => {
        const recipe = {
          name: values.name,
          ingredients: values.starterIngredients.concat(values.doughIngredients)
        }

        await createRecipe(recipe)
        onSave()
      }}>
      {({ values, isSubmitting, setFieldValue }) => (
        <FormikForm>
          <Field name="name">
            {({ field }: FieldProps<string>) => (
              <h1>
                <EditableText
                  value={field.value}
                  onChange={(value: string) => setFieldValue('name', value)}
                  multiline={true}
                  placeholder="Edit name..." />
              </h1>
            )}
          </Field>

          <h2>Ingredients</h2>

          <h3>{labelForIngredientGroup(IngredientGroup.starter)}</h3>

          <FieldArray
            name="starterIngredients"
            render={arrayHelpers => (
              <div>
                {values.starterIngredients.length > 0 && (
                  values.starterIngredients.map((_ingredient, index) => (
                    <div key={index}>
                      <ControlGroup>
                        <IngredientField prefix="starter" index={index} setFieldValue={setFieldValue} />
                        <Button icon="remove" onClick={() => arrayHelpers.remove(index)} />
                      </ControlGroup>
                    </div>
                  ))
                )}

                <Button icon="add" onClick={() => arrayHelpers.push({ type: IngredientType.flour, group: IngredientGroup.starter, weight: 0 })} />
              </div>
            )}
          />

          <h3>{labelForIngredientGroup(IngredientGroup.dough)}</h3>

          <FieldArray
            name="doughIngredients"
            render={arrayHelpers => (
              <div>
                {values.doughIngredients.length > 0 && (
                  values.doughIngredients.map((_ingredient, index) => (
                    <div key={index}>
                      <ControlGroup>
                        <IngredientField prefix="dough" index={index} setFieldValue={setFieldValue} />
                        <Button icon="remove" onClick={() => arrayHelpers.remove(index)} />
                      </ControlGroup>
                    </div>
                  ))
                )}

                <Button icon="add" onClick={() => arrayHelpers.push({ type: IngredientType.flour, group: IngredientGroup.dough, weight: 0 })} />
              </div>
            )}
          />

          <Button intent="primary" type="submit" loading={isSubmitting} disabled={isSubmitting || !CreateRecipeSchema.isValidSync(values)}>Save</Button>
        </FormikForm>
      )}
    </Formik>
  )
}

export default RecipeForm