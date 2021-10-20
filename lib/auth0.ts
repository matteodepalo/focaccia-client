import { initAuth0 } from '@auth0/nextjs-auth0'

export default initAuth0({
  baseURL: process.env.NEXT_PUBLIC_HOST,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN!}`,
  clientID: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.SESSION_COOKIE_SECRET!,
  clockTolerance: 60,
  httpTimeout: 5000,
  authorizationParams: {
    scope: 'openid profile offline_access',
    audience: process.env.NEXT_PUBLIC_API_URL
  },
  routes: {
    callback: '/api/callback',
    postLogoutRedirect: process.env.POST_LOGOUT_REDIRECT_URI!
  },
  session: {
    rollingDuration: 60 * 60 * 24,
    absoluteDuration: 60 * 60 * 24 * 7
  }
});