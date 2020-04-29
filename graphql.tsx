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
};

export type Recipe = {
  id: Scalars['Int'];
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type Query = {
  recipe: Recipe;
  recipes: Array<Recipe>;
};


export type QueryRecipeArgs = {
  id: Scalars['Int'];
};

export type Mutation = {
  createRecipe: Recipe;
  removeRecipe: Recipe;
};


export type MutationCreateRecipeArgs = {
  data: CreateRecipeInput;
};


export type MutationRemoveRecipeArgs = {
  id: Scalars['Int'];
};

export type CreateRecipeInput = {
  title: Scalars['String'];
  description: Scalars['String'];
};

export type CreateRecipeMutationVariables = {
  title: Scalars['String'];
  description: Scalars['String'];
};


export type CreateRecipeMutation = { createRecipe: Pick<Recipe, 'id' | 'title' | 'description'> };

export type GetRecipesQueryVariables = {};


export type GetRecipesQuery = { recipes: Array<Pick<Recipe, 'id' | 'title' | 'description'>> };

export type RemoveRecipeMutationVariables = {
  id: Scalars['Int'];
};


export type RemoveRecipeMutation = { removeRecipe: Pick<Recipe, 'id'> };


export const CreateRecipeDocument = gql`
    mutation createRecipe($title: String!, $description: String!) {
  createRecipe(data: {title: $title, description: $description}) {
    id
    title
    description
  }
}
    `;
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
 *      title: // value for 'title'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useCreateRecipeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateRecipeMutation, CreateRecipeMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateRecipeMutation, CreateRecipeMutationVariables>(CreateRecipeDocument, baseOptions);
      }
export type CreateRecipeMutationHookResult = ReturnType<typeof useCreateRecipeMutation>;
export type CreateRecipeMutationResult = ApolloReactCommon.MutationResult<CreateRecipeMutation>;
export type CreateRecipeMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateRecipeMutation, CreateRecipeMutationVariables>;
export const GetRecipesDocument = gql`
    query getRecipes {
  recipes {
    id
    title
    description
  }
}
    `;

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