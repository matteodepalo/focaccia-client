import { withApollo } from '../lib/apollo'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

type Recipe = {
  id: number
  title: string
  description: string
}

const GET_RECIPES = gql`
  query GetRecipes {
    recipes {
      id
      title
      description
    }
  }
`

const Home = () => {
  const {
    data,
    loading,
    error
  } = useQuery<{ recipes: Recipe[] }>(GET_RECIPES)

  let recipes: Recipe[] = []

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error Loading Recipes</p>
  if (data) recipes = data.recipes

  return (
    <section>
      <ul>
        {recipes ? recipes.map((recipe) => (
          <li key={recipe.id}>
            <div>
              <p>{recipe.title}</p>
              <p>{recipe.description}</p>
            </div>
          </li>
        )): <p>No recipes found</p>}
      </ul>
    </section>
  )
}

export default withApollo({ ssr: true })(Home)