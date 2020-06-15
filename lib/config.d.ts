interface Config {
  API_URL: string,
  AUTH0_CLIENT_ID: string,
  AUTH0_CLIENT_SECRET?: string,
  AUTH0_SCOPE: string,
  AUTH0_DOMAIN: string,
  REDIRECT_URI: string,
  POST_LOGOUT_REDIRECT_URI: string,
  HOST: string,
  SESSION_COOKIE_SECRET?: string,
  SESSION_COOKIE_LIFETIME?: number
}

const config: Config

export default config