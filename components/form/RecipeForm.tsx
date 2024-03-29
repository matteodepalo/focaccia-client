import { useCreateRecipeMutation, GetRecipesQuery, GetRecipesDocument, CreateRecipeMutationVariables, IngredientGroup, IngredientType, RecipeFieldsFragment, UpdateRecipeMutationVariables, useUpdateRecipeMutation, IngredientInput, StepInput } from 'lib/graphql'
import { EditableText, Switch, H3, H2, H1, Popover, Position, Menu, MenuItem, FormGroup, HTMLTable, ButtonGroup } from '@blueprintjs/core'
import { Formik, Form as FormikForm, FastField as Field, FieldProps, FieldArray, FormikHelpers, ErrorMessage } from 'formik'
import { FunctionComponent, useState } from 'react'
import * as Yup from 'yup';
import { nameRequiredForType, ingredientTypeIcon, ingredientTypeUnavailable, starterIngredients, doughIngredients, Ingredient } from 'lib/ingredients';
import { IngredientField } from './IngredientField';
import { Box, Flex } from 'rebass/styled-components';
import Totals from './Totals';
import DeleteButton from './DeleteButton';
import { useRouter } from 'next/router';
import { Button } from 'components/base/Button';
import { StepList } from './StepList';
import { icon } from 'lib/icons';
import { formatString, wrapNullableValue } from 'lib/field-helpers';
import i18n from 'i18n';

// type and group are required
export type IngredientFormField = Partial<IngredientInput> & Pick<IngredientInput, "type" | "group">

// position is required
export type StepFormField = Partial<StepInput> & Pick<StepInput, "position">

interface Props {
  recipe?: RecipeFieldsFragment
}

export interface FormValues {
  name: string,
  starterIngredients: IngredientFormField[],
  doughIngredients: IngredientFormField[],
  steps: StepFormField[]
}

function newIngredient<T extends IngredientType>(group: IngredientGroup, type: T): Ingredient<IngredientFormField, T> {
  return { type, group, name: nameRequiredForType(type) ? '' : undefined }
}

function newStep(values: FormValues): StepFormField {
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
    ],
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

  const [t] = i18n.useTranslation()

  Yup.setLocale({
    mixed: {
      default: t('errors.invalid'),
      required: t('errors.required')
    },
    number: {
      min: t('errors.greater-than-0',),
    },
  })

  const IngredientSchema = Yup.lazy((value): Yup.ObjectSchema<IngredientFormField> => {
    const object = Yup.object({
      weight: Yup.number().moreThan(0).required(),
      group: Yup.mixed<IngredientGroup>().oneOf(Object.values(IngredientGroup)).required(),
      type: Yup.mixed<IngredientType>().oneOf(Object.values(IngredientType)).required()
    })

    if (nameRequiredForType((value as IngredientFormField).type)) {
      return object.shape({
        name: Yup.string().required()
      })
    } else {
      return object
    }
  })

  const StepSchema: Yup.ObjectSchema<StepFormField> = Yup.object({
    description: Yup.string().required(),
    duration: Yup.number().nullable(),
    position: Yup.number().moreThan(0)
  })

  const RecipeSchema = Yup.object().shape({
    name: Yup.string().required(),
    starterIngredients: Yup.array()
      .of(IngredientSchema),
    doughIngredients: Yup.array()
      .of(IngredientSchema),
    steps: Yup.array()
      .of(StepSchema)
  });

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
          ingredients: values.doughIngredients.concat(values.starterIngredients) as IngredientInput[],
          steps: values.steps as StepInput[]
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
            {({ field }: FieldProps<IngredientFormField['name']>) => (
              <H1>
                <FormGroup intent={errors.name && touched.name ? "danger" : "none"} helperText={<ErrorMessage name="name" />}>
                  <EditableText
                    value={wrapNullableValue(field.value)}
                    confirmOnEnterKey={true}
                    onChange={(value) => setFieldValue('name', value)}
                    onConfirm={(value) => {
                      setFieldValue('name', formatString(value))
                      validateField(field.name)
                    }}
                    onCancel={() => validateField(field.name)}
                    multiline={true}
                    placeholder={t('name-placeholder')} />
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
            <H2>{t('ingredients')}</H2>
          </Box>

          <Box mt={4}>
            <Flex alignItems="center">
              <H3>{t(IngredientGroup.starter)}</H3>

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

                  <Button icon={icon("add")} text={t('add')} minimal={true} onClick={() => arrayHelpers.push(newIngredient(IngredientGroup.starter, IngredientType.other))} />
                </div>
              )}
            />
          </Box>}

          <Box mt={4}>
            <H3>{t(IngredientGroup.dough)}</H3>

            <Box mt={3}>
              <FieldArray
                name="doughIngredients"
                render={arrayHelpers => (
                  <div>
                    <Box mb={3}>
                      {values.doughIngredients.length > 0 && (
                        values.doughIngredients.map((_ingredient, index) => (
                          <IngredientField
                            key={index}
                            prefix="dough"
                            index={index}
                            setFieldValue={setFieldValue}
                            formValues={values}
                            errors={errors}
                            touched={touched}
                            onRemove={() => arrayHelpers.remove(index)}
                            validateField={validateField} />
                        ))
                      )}
                    </Box>

                    <Popover
                      position={Position.RIGHT_TOP}
                      content={
                        <Menu>
                          {Object.values(IngredientType).map((type, index) => {
                            return <MenuItem
                              key={index}
                              icon={ingredientTypeIcon(type)}
                              onClick={() => arrayHelpers.push(newIngredient(IngredientGroup.dough, type))}
                              text={t(type)}
                              disabled={ingredientTypeUnavailable(type, values.doughIngredients)}/>
                          })}
                        </Menu>}>
                        <Button icon={icon("add")} text={t('add')} minimal={true} />
                    </Popover>
                  </div>
                )}
              />
            </Box>
          </Box>

          <Box mt={4}>
            <H2>{t('steps')}</H2>

            <FieldArray
              name="steps"
              render={arrayHelpers => (
                <>
                  {values.steps.length > 0 && <HTMLTable striped={true}>
                    <StepList
                      steps={values.steps}
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                      validateField={validateField}
                      arrayHelpers={arrayHelpers} />

                  </HTMLTable>}

                  <Box mt={2}>
                    <Button icon={icon("add")} text={t('add')} minimal={true} onClick={() => arrayHelpers.push(newStep(values))} />
                  </Box>
                </>
              )} />
          </Box>

          <Box mt={4} width={80}>
            <ButtonGroup vertical={true}>
              <Button icon={icon("save")} intent="primary" type="submit" loading={isSubmitting} disabled={isSubmitting}>{t('save')}</Button>

              {recipe &&
                <DeleteButton recipe={recipe} />
              }
            </ButtonGroup>
          </Box>
        </FormikForm>
      )}
    </Formik>
  )
}

export default RecipeForm