import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: Date;
};

export type Ingredient = {
  id: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  weight: Scalars['Float'];
  name?: Maybe<Scalars['String']>;
  type: IngredientType;
  group: IngredientGroup;
};


export enum IngredientType {
  yeast = 'yeast',
  water = 'water',
  salt = 'salt',
  flour = 'flour',
  other = 'other'
}

export enum IngredientGroup {
  starter = 'starter',
  dough = 'dough'
}

export type Step = {
  id: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  position: Scalars['Int'];
  duration?: Maybe<Scalars['Int']>;
  description: Scalars['String'];
};

export type Recipe = {
  id: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  userId: Scalars['String'];
  name: Scalars['String'];
  ingredients: Array<Ingredient>;
  steps: Array<Step>;
  token: Scalars['String'];
};

export type Query = {
  recipe: Recipe;
  recipes: Array<Recipe>;
};


export type QueryRecipeArgs = {
  id?: Maybe<Scalars['Int']>;
  token?: Maybe<Scalars['String']>;
};

export type Mutation = {
  createRecipe: Recipe;
  updateRecipe: Recipe;
  removeRecipe: Recipe;
};


export type MutationCreateRecipeArgs = {
  data: RecipeInput;
};


export type MutationUpdateRecipeArgs = {
  data: RecipeInput;
};


export type MutationRemoveRecipeArgs = {
  id: Scalars['Int'];
};

export type RecipeInput = {
  id?: Maybe<Scalars['Int']>;
  ingredients: Array<IngredientInput>;
  steps: Array<StepInput>;
  name: Scalars['String'];
};

export type IngredientInput = {
  id?: Maybe<Scalars['Int']>;
  weight: Scalars['Float'];
  name?: Maybe<Scalars['String']>;
  type: IngredientType;
  group: IngredientGroup;
};

export type StepInput = {
  id?: Maybe<Scalars['Int']>;
  position: Scalars['Int'];
  duration?: Maybe<Scalars['Int']>;
  description: Scalars['String'];
};

export type IngredientFieldsFragment = Pick<Ingredient, 'id' | 'name' | 'type' | 'group' | 'weight'>;

export type StepsFieldsFragment = Pick<Step, 'id' | 'description' | 'duration' | 'position'>;

export type RecipeFieldsFragment = (
  Pick<Recipe, 'id' | 'name' | 'token'>
  & { ingredients: Array<IngredientFieldsFragment>, steps: Array<StepsFieldsFragment> }
);

export type GetRecipesQueryVariables = {};


export type GetRecipesQuery = { recipes: Array<RecipeFieldsFragment> };

export type GetRecipeQueryVariables = {
  id?: Maybe<Scalars['Int']>;
  token?: Maybe<Scalars['String']>;
};


export type GetRecipeQuery = { recipe: RecipeFieldsFragment };

export type CreateRecipeMutationVariables = {
  data: RecipeInput;
};


export type CreateRecipeMutation = { createRecipe: RecipeFieldsFragment };

export type UpdateRecipeMutationVariables = {
  data: RecipeInput;
};


export type UpdateRecipeMutation = { updateRecipe: RecipeFieldsFragment };

export type RemoveRecipeMutationVariables = {
  id: Scalars['Int'];
};


export type RemoveRecipeMutation = { removeRecipe: Pick<Recipe, 'id'> };

export const IngredientFieldsFragmentDoc = gql`
    fragment ingredientFields on Ingredient {
  id
  name
  type
  group
  weight
}
    `;
export const StepsFieldsFragmentDoc = gql`
    fragment stepsFields on Step {
  id
  description
  duration
  position
}
    `;
export const RecipeFieldsFragmentDoc = gql`
    fragment recipeFields on Recipe {
  id
  name
  token
  ingredients {
    ...ingredientFields
  }
  steps {
    ...stepsFields
  }
}
    ${IngredientFieldsFragmentDoc}
${StepsFieldsFragmentDoc}`;
export const GetRecipesDocument = gql`
    query getRecipes {
  recipes {
    ...recipeFields
  }
}
    ${RecipeFieldsFragmentDoc}`;

/**
 * __useGetRecipesQuery__
 *
 * To run a query within a React component, call `useGetRecipesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecipesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecipesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRecipesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetRecipesQuery, GetRecipesQueryVariables>) {
        return ApolloReactHooks.useQuery<GetRecipesQuery, GetRecipesQueryVariables>(GetRecipesDocument, baseOptions);
      }
export function useGetRecipesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRecipesQuery, GetRecipesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetRecipesQuery, GetRecipesQueryVariables>(GetRecipesDocument, baseOptions);
        }
export type GetRecipesQueryHookResult = ReturnType<typeof useGetRecipesQuery>;
export type GetRecipesLazyQueryHookResult = ReturnType<typeof useGetRecipesLazyQuery>;
export type GetRecipesQueryResult = ApolloReactCommon.QueryResult<GetRecipesQuery, GetRecipesQueryVariables>;
export const GetRecipeDocument = gql`
    query getRecipe($id: Int, $token: String) {
  recipe(id: $id, token: $token) {
    ...recipeFields
  }
}
    ${RecipeFieldsFragmentDoc}`;

/**
 * __useGetRecipeQuery__
 *
 * To run a query within a React component, call `useGetRecipeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecipeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecipeQuery({
 *   variables: {
 *      id: // value for 'id'
 *      token: // value for 'token'
 *   },
 * });
 */
export function useGetRecipeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetRecipeQuery, GetRecipeQueryVariables>) {
        return ApolloReactHooks.useQuery<GetRecipeQuery, GetRecipeQueryVariables>(GetRecipeDocument, baseOptions);
      }
export function useGetRecipeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRecipeQuery, GetRecipeQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetRecipeQuery, GetRecipeQueryVariables>(GetRecipeDocument, baseOptions);
        }
export type GetRecipeQueryHookResult = ReturnType<typeof useGetRecipeQuery>;
export type GetRecipeLazyQueryHookResult = ReturnType<typeof useGetRecipeLazyQuery>;
export type GetRecipeQueryResult = ApolloReactCommon.QueryResult<GetRecipeQuery, GetRecipeQueryVariables>;
export const CreateRecipeDocument = gql`
    mutation createRecipe($data: RecipeInput!) {
  createRecipe(data: $data) {
    ...recipeFields
  }
}
    ${RecipeFieldsFragmentDoc}`;
export type CreateRecipeMutationFn = ApolloReactCommon.MutationFunction<CreateRecipeMutation, CreateRecipeMutationVariables>;

/**
 * __useCreateRecipeMutation__
 *
 * To run a mutation, you first call `useCreateRecipeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRecipeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRecipeMutation, { data, loading, error }] = useCreateRecipeMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateRecipeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateRecipeMutation, CreateRecipeMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateRecipeMutation, CreateRecipeMutationVariables>(CreateRecipeDocument, baseOptions);
      }
export type CreateRecipeMutationHookResult = ReturnType<typeof useCreateRecipeMutation>;
export type CreateRecipeMutationResult = ApolloReactCommon.MutationResult<CreateRecipeMutation>;
export type CreateRecipeMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateRecipeMutation, CreateRecipeMutationVariables>;
export const UpdateRecipeDocument = gql`
    mutation updateRecipe($data: RecipeInput!) {
  updateRecipe(data: $data) {
    ...recipeFields
  }
}
    ${RecipeFieldsFragmentDoc}`;
export type UpdateRecipeMutationFn = ApolloReactCommon.MutationFunction<UpdateRecipeMutation, UpdateRecipeMutationVariables>;

/**
 * __useUpdateRecipeMutation__
 *
 * To run a mutation, you first call `useUpdateRecipeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRecipeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRecipeMutation, { data, loading, error }] = useUpdateRecipeMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateRecipeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateRecipeMutation, UpdateRecipeMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateRecipeMutation, UpdateRecipeMutationVariables>(UpdateRecipeDocument, baseOptions);
      }
export type UpdateRecipeMutationHookResult = ReturnType<typeof useUpdateRecipeMutation>;
export type UpdateRecipeMutationResult = ApolloReactCommon.MutationResult<UpdateRecipeMutation>;
export type UpdateRecipeMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateRecipeMutation, UpdateRecipeMutationVariables>;
export const RemoveRecipeDocument = gql`
    mutation removeRecipe($id: Int!) {
  removeRecipe(id: $id) {
    id
  }
}
    `;
export type RemoveRecipeMutationFn = ApolloReactCommon.MutationFunction<RemoveRecipeMutation, RemoveRecipeMutationVariables>;

/**
 * __useRemoveRecipeMutation__
 *
 * To run a mutation, you first call `useRemoveRecipeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveRecipeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeRecipeMutation, { data, loading, error }] = useRemoveRecipeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveRecipeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RemoveRecipeMutation, RemoveRecipeMutationVariables>) {
        return ApolloReactHooks.useMutation<RemoveRecipeMutation, RemoveRecipeMutationVariables>(RemoveRecipeDocument, baseOptions);
      }
export type RemoveRecipeMutationHookResult = ReturnType<typeof useRemoveRecipeMutation>;
export type RemoveRecipeMutationResult = ApolloReactCommon.MutationResult<RemoveRecipeMutation>;
export type RemoveRecipeMutationOptions = ApolloReactCommon.BaseMutationOptions<RemoveRecipeMutation, RemoveRecipeMutationVariables>;