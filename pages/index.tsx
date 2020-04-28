import { withApollo } from '../lib/apollo'
import RecipeForm from '../components/RecipeForm';
import RecipeList from '../components/RecipeList';

const Home = () => {
  return (
    <section>
      <RecipeList/>
      <RecipeForm/>
    </section>
  )
}

export default withApollo({ ssr: true })(Home)