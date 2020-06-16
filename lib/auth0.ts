import { initAuth0 } from '@auth0/nextjs-auth0'

export default initAuth0({
  clientId: process.env.AUTH0_CLIENT_ID || 'http://localhost:3001/graphql',
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: 'openid profile offline_access',
  domain: process.env.AUTH0_DOMAIN || 'focaccia.eu.auth0.com',
  redirectUri: process.env.REDIRECT_URI || 'http://localhost:3000/api/callback',
  audience: process.env.API_URL,
  postLogoutRedirectUri: process.env.POST_LOGOUT_REDIRECT_URI || 'http://localhost:3000',
  session: {
    cookieSecret: process.env.SESSION_COOKIE_SECRET!,
    cookieLifetime: parseInt(process.env.SESSION_COOKIE_LIFETIME || "7200", 10),
    storeAccessToken: true,
    storeIdToken: true,
    storeRefreshToken: true
  },
})
