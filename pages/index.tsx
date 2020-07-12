import { NonIdealState } from '@blueprintjs/core'
import { withAuth } from 'lib/withAuth'
import i18n from 'i18n'

const Home = () => {
  const [t] = i18n.useTranslation();

  return (
    <NonIdealState
      title={t('welcome')} />
  )
}

export default withAuth({ required: false })(Home)