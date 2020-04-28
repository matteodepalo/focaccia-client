import { withApollo } from '../lib/apollo'
import RecipeForm from '../components/RecipeForm'
import RecipeList from '../components/RecipeList'
import styles from './index.module.css'

const Home = () => {
  return (
    <section className={styles.mainSection}>
      <h1>Recipes</h1>
      <RecipeList/>
      <RecipeForm/>
    </section>
  )
}

export default withApollo({ ssr: true })(Home)