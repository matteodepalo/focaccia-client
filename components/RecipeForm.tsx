import { useCreateRecipeMutation, GetRecipesQuery, GetRecipesDocument, CreateRecipeMutationVariables, IngredientGroup, IngredientType, RecipeFieldsFragment, UpdateRecipeMutationVariables, useUpdateRecipeMutation, IngredientInput } from '../graphql'
import { Button, EditableText, Switch, H3, H2, H1 } from '@blueprintjs/core'
import { Formik, Form as FormikForm, Field, FieldProps, FieldArray } from 'formik'
import { FunctionComponent, useState } from 'react'
import * as Yup from 'yup';
import { labelForIngredientGroup } from '../lib/ingredients';
import { IngredientField } from './IngredientField';
import { starterIngredients, doughIngredients, nameRequiredForType } from '../lib/recipe';
import { Box, Flex } from 'rebass/styled-components';

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

function newIngredient(group: IngredientGroup, type: IngredientType = IngredientType.flour): IngredientInput {
  return { type, group, weight: 0 }
}

const RecipeForm: FunctionComponent<Props> = ({ recipe, onSave }) => {
  const [createRecipeMutation] = useCreateRecipeMutation()
  const [updateRecipeMutation] = useUpdateRecipeMutation()
  const [starterEnabled, setStarterEnabled] = useState(!!recipe && starterIngredients(recipe).length > 0)

  const initialValues = {
    name: recipe?.name ?? '',
    starterIngredients: recipe ? starterIngredients(recipe) : [
      newIngredient(IngredientGroup.starter, IngredientType.water),
      newIngredient(IngredientGroup.starter, IngredientType.flour),
      newIngredient(IngredientGroup.starter, IngredientType.yeast)
    ],
    doughIngredients: recipe ? doughIngredients(recipe) : [
      newIngredient(IngredientGroup.starter, IngredientType.water),
      newIngredient(IngredientGroup.starter, IngredientType.flour)
    ]
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
      validateOnMount={true}
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
              <H1>
                <EditableText
                  value={field.value}
                  confirmOnEnterKey={true}
                  onChange={(value: string) => setFieldValue('name', value)}
                  onConfirm={() => validateField(field.name)}
                  onCancel={() => validateField(field.name)}
                  multiline={true}
                  placeholder="Edit name..." />
              </H1>
            )}
          </Field>

          <Box mt={4}>
            <H2>Ingredients</H2>
          </Box>

          <Box mt={4}>
            <Flex alignItems="center">
              <H3>{labelForIngredientGroup(IngredientGroup.starter)}</H3>

              <Switch
                checked={starterEnabled}
                large={true}
                style={{ marginLeft: 10 }}
                onChange={(event) => {
                  setStarterEnabled(event.currentTarget.checked)
                }} />
            </Flex>

            {starterEnabled && <Box mt={3}>
              <FieldArray
                name="starterIngredients"
                render={() => (
                  <div>
                    {values.starterIngredients.length > 0 && (
                      values.starterIngredients.map((ingredient, index) => (
                        <IngredientField
                          key={index}
                          prefix="starter"
                          index={index}
                          setFieldValue={setFieldValue}
                          formValues={values}
                          type={ingredient.type} />
                      ))
                    )}
                  </div>
                )}
              />
            </Box>}
          </Box>

          <Box mt={4}>
            <H3>{labelForIngredientGroup(IngredientGroup.dough)}</H3>

            <Box mt={3}>
              <FieldArray
                  name="doughIngredients"
                  render={arrayHelpers => (
                    <div>
                      {values.doughIngredients.length > 0 && (
                        values.doughIngredients.map((ingredient, index) => (
                          <IngredientField
                            key={index}
                            prefix="dough"
                            index={index}
                            setFieldValue={setFieldValue}
                            formValues={values}
                            type={ingredient.type}
                            onRemove={() => arrayHelpers.remove(index)} />
                        ))
                      )}

                      <Button icon="add" onClick={() => arrayHelpers.push(newIngredient(IngredientGroup.dough))} minimal={true}>
                        Add Ingredient
                      </Button>
                    </div>
                  )}
                />
            </Box>
          </Box>


          <Box mt={4}>
            <Button intent="primary" type="submit" loading={isSubmitting} disabled={isSubmitting || !isValid}>Save</Button>
          </Box>
        </FormikForm>
      )}
    </Formik>
  )
}

export default RecipeForm