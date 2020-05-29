import { useCreateRecipeMutation, GetRecipesQuery, GetRecipesDocument, CreateRecipeMutationVariables, IngredientGroup, IngredientType, RecipeFieldsFragment, UpdateRecipeMutationVariables, useUpdateRecipeMutation, IngredientInput } from '../graphql'
import { Button, EditableText } from '@blueprintjs/core'
import { Formik, Form as FormikForm, Field, FieldProps, FieldArray } from 'formik'
import { FunctionComponent } from 'react'
import * as Yup from 'yup';
import { labelForIngredientGroup } from '../lib/ingredients';
import { IngredientField } from './IngredientField';
import { starterIngredients, doughIngredients, nameRequiredForType } from '../lib/recipe';
import { Box } from 'rebass/styled-components';

// TODO: figure out why this is called for every ingredient twice

const IngredientSchema = Yup.lazy((value): Yup.ObjectSchema<IngredientInput> => {
  const object = Yup.object({
    weight: Yup.number().moreThan(0).required(),
    group: Yup.mixed<IngredientGroup>().oneOf(Object.values(IngredientGroup)).required(),
    type: Yup.mixed<IngredientType>().oneOf(Object.values(IngredientType)).required()
  })

  if (nameRequiredForType((value as IngredientInput).type)) {
    return object.shape({
      name: Yup.string().required()
    })
  } else {
    return object
  }
})

const RecipeSchema = Yup.object().shape({
  name: Yup.string().required(),
  starterIngredients: Yup.array()
    .of(IngredientSchema),
  doughIngredients: Yup.array()
    .of(IngredientSchema)
    .required('Must have doughIngredients')
});

interface Props {
  recipe?: RecipeFieldsFragment
  onSave: () => void
}

export interface FormValues {
  name: string,
  starterIngredients: IngredientInput[],
  doughIngredients: IngredientInput[]
}

function newIngredient(group: IngredientGroup): IngredientInput {
  return { type: IngredientType.flour, group: group, weight: 0 }
}

const RecipeForm: FunctionComponent<Props> = ({ recipe, onSave }) => {
  const [createRecipeMutation] = useCreateRecipeMutation()
  const [updateRecipeMutation] = useUpdateRecipeMutation()

  const initialValues = {
    name: recipe?.name ?? '',
    starterIngredients: recipe ? starterIngredients(recipe) : [],
    doughIngredients: recipe ? doughIngredients(recipe) : []
  }

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

  const updateRecipe = async (data: UpdateRecipeMutationVariables['data']) => {
    await updateRecipeMutation({ variables: { data } })
  }

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={RecipeSchema}
      validateOnBlur={true}
      validateOnChange={false}
      validateOnMount={false}
      onSubmit={async (values) => {
        const recipeInput = {
          name: values.name,
          ingredients: values.starterIngredients.concat(values.doughIngredients)
        }

        if (recipe?.id) {
          const updateRecipeInput = {
            ...recipeInput,
            id: recipe.id
          }

          await updateRecipe(updateRecipeInput)
        } else {
          await createRecipe(recipeInput)
        }

        onSave()
      }}>
      {({ values, isSubmitting, setFieldValue, isValid, validateField }) => (
        <FormikForm>
          <Field name="name">
            {({ field }: FieldProps<string>) => (
              <h1>
                <EditableText
                  value={field.value}
                  confirmOnEnterKey={true}
                  onChange={(value: string) => setFieldValue('name', value)}
                  onConfirm={() => validateField(field.name)}
                  onCancel={() => validateField(field.name)}
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
                    <IngredientField
                      key={index}
                      prefix="starter"
                      index={index}
                      setFieldValue={setFieldValue}
                      formValues={values}
                      onRemove={() => arrayHelpers.remove(index)} />
                  ))
                )}

                <Button icon="add" onClick={() => arrayHelpers.push(newIngredient(IngredientGroup.starter))} minimal={true} />
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
                    <IngredientField
                      key={index}
                      prefix="dough"
                      index={index}
                      setFieldValue={setFieldValue}
                      formValues={values}
                      onRemove={() => arrayHelpers.remove(index)} />
                  ))
                )}

                <Button icon="add" onClick={() => arrayHelpers.push(newIngredient(IngredientGroup.dough))} minimal={true} />
              </div>
            )}
          />

          <Box mt={4}>
            <Button intent="primary" type="submit" loading={isSubmitting} disabled={isSubmitting || !isValid}>Save</Button>
          </Box>
        </FormikForm>
      )}
    </Formik>
  )
}

export default RecipeForm