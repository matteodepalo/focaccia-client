import { initAuth0 } from '@auth0/nextjs-auth0'

export default initAuth0({
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: 'openid profile offline_access',
  domain: process.env.AUTH0_DOMAIN!,
  redirectUri: process.env.REDIRECT_URI!,
  audience: process.env.NEXT_PUBLIC_API_URL,
  postLogoutRedirectUri: process.env.POST_LOGOUT_REDIRECT_URI!,
  session: {
    cookieSecret: process.env.SESSION_COOKIE_SECRET!,
    cookieLifetime: parseInt(process.env.SESSION_COOKIE_LIFETIME || "7200", 10),
    storeAccessToken: true,
    storeIdToken: true,
    storeRefreshToken: true
  },
})
