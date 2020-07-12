import auth0 from 'lib/auth0'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    await auth0.handleLogin(req, res, { authParams: { ui_locales: req.query.ui_locales?.toString() ?? 'en' }})
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
}