const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants')

module.exports = phase => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER
  const isProd = phase === PHASE_PRODUCTION_BUILD

  const env = {
    API_URL: (() => {
      if (isDev) { return 'http://localhost:3001/graphql' }
      else if (isProd) { return 'https://focaccia-server.herokuapp.com/graphql' }
      else { return 'http://localhost:3001/graphql' }
    })()
  }

  return {
    env
  }
}