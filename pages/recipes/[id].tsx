import RecipeDetail from "../../components/RecipeDetail"
import { useRouter } from "next/router"
import withApollo from "../../lib/withApollo"
import { withAuthenticated } from "../../lib/withAuthenticated"
import { getDataFromTree } from '@apollo/react-ssr';

const Recipe = () => {
  const router = useRouter()

  return <RecipeDetail id={parseInt(router.query!.id as string, 10)} />
}

export default withApollo(withAuthenticated()(Recipe), { getDataFromTree })