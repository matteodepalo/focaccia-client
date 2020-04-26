import { GetServerSideProps } from 'next'
import axios from 'axios'
import config from '../next.config'

type Props = {
  number: number
}

export const getServerSideProps: GetServerSideProps<Props> = async _context => {
  const response = await axios.get(config().env.API_URL)
  const number = +response.data

  return { props: { number } }
}

const Home = ({ number }: Props) => {
  return (
    <p>
      Random Number: {number}
    </p>
  )
}

export default Home