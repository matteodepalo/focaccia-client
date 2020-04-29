import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Recipe, CreateRecipeInput } from '../graphql';
import { FormEvent, useState } from 'react';
import { GET_RECIPES } from './RecipeList';

const CREATE_RECIPE = gql`
  mutation createRecipe($title: String, $description: String) {
    createRecipe(title: $title, description: $description) {
      id
      title
      description
    }
  }
`

const RecipeForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [createRecipe, { loading }] = useMutation<{ createRecipe: Recipe }, CreateRecipeInput>(CREATE_RECIPE);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement
    form.reset()

    createRecipe({
      variables: { title, description },
      update: (cache, { data: createRecipe }) => {
        const data = cache.readQuery<{ recipes: Recipe[] }>({
          query: GET_RECIPES
        })

        if (data && createRecipe) {
          cache.writeQuery({
            query: GET_RECIPES,
            data: {
              recipes: [createRecipe.createRecipe, ...data.recipes]
            }
          })
        }
      },
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" name="title" onChange={e => setTitle(e.target.value)} />
      </label>

      <label>
        Description:
        <input type="text" name="description" onChange={e => setDescription(e.target.value)} />
      </label>
      <input type="submit" value="Submit" disabled={loading}/>
    </form>
  )
}

export default RecipeForm