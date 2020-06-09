import { useCreateRecipeMutation, GetRecipesQuery, GetRecipesDocument, CreateRecipeMutationVariables, IngredientGroup, IngredientType, RecipeFieldsFragment, UpdateRecipeMutationVariables, useUpdateRecipeMutation, IngredientInput, StepInput } from '../../graphql'
import { EditableText, Switch, H3, H2, H1, Popover, Position, Menu, MenuItem, FormGroup, HTMLTable } from '@blueprintjs/core'
import { Formik, Form as FormikForm, Field, FieldProps, FieldArray, FormikHelpers, ErrorMessage } from 'formik'
import { FunctionComponent, useState } from 'react'
import * as Yup from 'yup';
import { labelForIngredientGroup, nameRequiredForType, ingredientTypeIcon, ingredientTypesWithLabels, doughIngredientRequired, ingredientTypeUnavailable, DoughIngredients, starterIngredients, doughIngredients, Ingredient } from '../../lib/ingredients';
import { IngredientField } from './IngredientField';
import { Box, Flex } from 'rebass/styled-components';
import Totals from './Totals';
import DeleteButton from './DeleteButton';
import { StepField } from './StepField';
import { orderBy } from 'lodash';
import { useRouter } from 'next/router';
import { Button } from '../base/Button';

const IngredientSchema = Yup.lazy((value): Yup.ObjectSchema<IngredientInput> => {
  const object = Yup.object({
    weight: Yup.number().moreThan(0, 'must be greater than 0').required(),
    group: Yup.mixed<IngredientGroup>().oneOf(Object.values(IngredientGroup)).required(),
    type: Yup.mixed<IngredientType>().oneOf(Object.values(IngredientType)).required()
  })

  if (nameRequiredForType((value as IngredientInput).type)) {
    return object.shape({
      name: Yup.string().required('Name is required')
    })
  } else {
    return object
  }
})

const StepSchema: Yup.ObjectSchema<StepInput> = Yup.object({
  description: Yup.string().required(),
  duration: Yup.number().moreThan(0, 'must be greater than 0'),
  position: Yup.number().moreThan(0, 'must be greater than 0')
})

const RecipeSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  starterIngredients: Yup.array()
    .of(IngredientSchema),
  doughIngredients: Yup.array()
    .of(IngredientSchema),
  steps: Yup.array()
    .of(StepSchema)
});

interface Props {
  recipe?: RecipeFieldsFragment
}

export interface FormValues {
  name: string,
  starterIngredients: IngredientInput[],
  doughIngredients: DoughIngredients<IngredientInput>,
  steps: StepInput[]
}

function newIngredient<T extends IngredientType>(group: IngredientGroup, type: T): Ingredient<IngredientInput, T> {
  return { type, group, weight: 0, name: nameRequiredForType(type) ? '' : undefined }
}

function newStep(values: FormValues): StepInput {
  return { position: values.steps.length + 1, description: '' }
}

const RecipeForm: FunctionComponent<Props> = ({ recipe }) => {
  const [createRecipeMutation] = useCreateRecipeMutation()
  const [updateRecipeMutation] = useUpdateRecipeMutation()
  const [starterEnabled, setStarterEnabled] = useState(!!recipe && starterIngredients(recipe.ingredients).length > 0)
  const router = useRouter()

  const initialValues = {
    name: recipe?.name ?? '',
    starterIngredients: recipe ? starterIngredients(recipe.ingredients) : [],
    doughIngredients: recipe ? doughIngredients(recipe.ingredients) : [
      newIngredient(IngredientGroup.dough, IngredientType.water),
      newIngredient(IngredientGroup.dough, IngredientType.flour)
    ] as DoughIngredients<IngredientInput>,
    steps: recipe?.steps ?? []
  }

  const createRecipe = async (data: CreateRecipeMutationVariables['data']) => {
    return await createRecipeMutation({
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
    return await updateRecipeMutation({ variables: { data } })
  }

  const toggleStarterEnabled = (enabled: boolean, setFieldValue: FormikHelpers<any>['setFieldValue']) => {
    if (enabled) {
      setFieldValue('starterIngredients', [
        newIngredient(IngredientGroup.starter, IngredientType.water),
        newIngredient(IngredientGroup.starter, IngredientType.flour),
        newIngredient(IngredientGroup.starter, IngredientType.yeast)
      ])
    } else {
      setFieldValue('starterIngredients', [])
    }

    setStarterEnabled(enabled)
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
          ingredients: values.doughIngredients.concat(values.starterIngredients),
          steps: values.steps
        }

        if (recipe?.id) {
          const updateRecipeInput = {
            ...recipeInput,
            id: recipe.id
          }

          const updatedRecipe = await updateRecipe(updateRecipeInput)
          // TODO: handle possible server validation errors
          const id = updatedRecipe.data!.updateRecipe.id
          router.push('/recipes/[id]', `/recipes/${id}`)
        } else {
          const createdRecipe = await createRecipe(recipeInput)
          // TODO: handle possible server validation errors
          const id = createdRecipe.data!.createRecipe.id
          router.push('/recipes/[id]', `/recipes/${id}`)
        }
      }}>
      {({ values, isSubmitting, setFieldValue, validateField, errors, touched, setValues, validateForm }) => (
        <FormikForm>
          <Field name="name">
            {({ field }: FieldProps<string>) => (
              <H1>
                <FormGroup intent={errors.name && touched.name ? "danger" : "none"} helperText={<ErrorMessage name="name"/>}>
                  <EditableText
                    value={field.value}
                    confirmOnEnterKey={true}
                    onChange={(value: string) => setFieldValue('name', value)}
                    onConfirm={() => validateField(field.name)}
                    onCancel={() => validateField(field.name)}
                    multiline={true}
                    placeholder="Edit name..." />
                </FormGroup>
              </H1>
            )}
          </Field>

          <Totals
            starterIngredients={values.starterIngredients}
            doughIngredients={values.doughIngredients}
            onTotalsChange={({ starterIngredients, doughIngredients }) => {
              let newValues = {
                ...values,
                starterIngredients,
                doughIngredients
              }

              setValues(newValues)
              validateForm(newValues)
            }}/>

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
                  toggleStarterEnabled(event.currentTarget.checked, setFieldValue)
                }} />
            </Flex>
          </Box>

          {starterEnabled && <Box mt={3}>
            <FieldArray
              name="starterIngredients"
              render={arrayHelpers => (
                <div>
                  {values.starterIngredients.length > 0 && (
                    values.starterIngredients.map((ingredient, index) => (
                      <IngredientField
                        key={index}
                        prefix="starter"
                        index={index}
                        setFieldValue={setFieldValue}
                        formValues={values}
                        errors={errors}
                        validateField={validateField}
                        touched={touched}
                        onRemove={ingredient.type === IngredientType.other ? () => arrayHelpers.remove(index) : undefined} />
                    ))
                  )}

                  <Button icon="add" text="Add Ingredient" minimal={true} onClick={() => arrayHelpers.push(newIngredient(IngredientGroup.starter, IngredientType.other))} />
                </div>
              )}
            />
          </Box>}

          <Box mt={4}>
            <H3>{labelForIngredientGroup(IngredientGroup.dough)}</H3>

            <Box mt={3}>
              <FieldArray
                name="doughIngredients"
                render={arrayHelpers => (
                  <div>
                    <Box mb={3}>
                      {values.doughIngredients.length > 0 && (
                        values.doughIngredients.map((ingredient, index) => (
                          <IngredientField
                            key={index}
                            prefix="dough"
                            index={index}
                            setFieldValue={setFieldValue}
                            formValues={values}
                            errors={errors}
                            touched={touched}
                            onRemove={doughIngredientRequired(ingredient, values.doughIngredients) ? undefined : () => arrayHelpers.remove(index)}
                            validateField={validateField} />
                        ))
                      )}
                    </Box>

                    <Popover
                      position={Position.RIGHT_TOP}
                      content={
                        <Menu>
                          {ingredientTypesWithLabels.map((type, index) => {
                            return <MenuItem
                              key={index}
                              icon={ingredientTypeIcon(type.value)}
                              onClick={() => arrayHelpers.push(newIngredient(IngredientGroup.dough, type.value))}
                              text={type.label}
                              disabled={ingredientTypeUnavailable(type.value, values.doughIngredients)}/>
                          })}
                        </Menu>}>
                        <Button icon="add" text="Add Ingredient" minimal={true} />
                    </Popover>
                  </div>
                )}
              />
            </Box>
          </Box>

          <Box mt={4}>
            <H2>Steps</H2>

            <FieldArray
              name="steps"
              render={arrayHelpers => (
                <>
                  <HTMLTable striped={true}>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Description</th>
                        <th>Time</th>
                      </tr>
                    </thead>

                    <tbody>
                      {values.steps.length > 0 && (
                        orderBy(values.steps, 'position').map((_step, index) => (
                          <StepField
                            key={index}
                            index={index}
                            setFieldValue={setFieldValue}
                            errors={errors}
                            touched={touched}
                            validateField={validateField}
                            onRemove={() => arrayHelpers.remove(index)} />
                        ))
                      )}
                    </tbody>
                  </HTMLTable>

                  <Box mt={2}>
                    <Button icon="add" text="Add Step" minimal={true} onClick={() => arrayHelpers.push(newStep(values))} />
                  </Box>
                </>
              )} />
          </Box>

          <Box mt={4}>
            <Button icon="floppy-disk" intent="primary" type="submit" loading={isSubmitting} disabled={isSubmitting}>Save</Button>
          </Box>

          {recipe &&
            <Box mt={1}>
              <DeleteButton recipe={recipe} />
            </Box>
          }
        </FormikForm>
      )}
    </Formik>
  )
}

export default RecipeForm