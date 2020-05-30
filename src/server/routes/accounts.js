// Return a session object (without any private fields) for Single Page App clients
import cookie from '../lib/cookie'

export default async (req, res, options, done) => {
  const { cookies, adapter } = options
  const { getSession, updateSession, getAccounts  } = await adapter.getAdapter(options)
  
  const sessionToken = req.cookies[cookies.sessionToken.name]

  let response = {}

  if (sessionToken) { // Don't check session if it doesn't exist!
    try {
      const session = await getSession(sessionToken)
      if (session) 
      {
        // Trigger update to session object to update sessionExpires
        await updateSession(session)
        const accountsResult = await getAccounts(session.userId);

        let accounts = {}
      
        accountsResult.forEach(account => {
          accounts[account.providerId] = {
            ...accounts,
            accessToken: account.accessToken,
            accessTokenExpires: account.accessTokenExpires
          }
        })

        // Only expose a limited subset of information to the client as needed
        //
        // @TODO Should support `async seralizeUser({ user, function })` style
        // middleware function to allow response to be customized.
        response = {
          accounts: accounts
        }

        // // Update expiry on Session Token cookie
        cookie.set(res, cookies.sessionToken.name, sessionToken, { expires: session.sessionExpires, ...cookies.sessionToken.options })
      } 
      else if (sessionToken) 
      {
        // If sessionToken was found set but it's not valid for a session then
        // remove the sessionToken cookie from browser.
        cookie.set(res, cookies.sessionToken.name, '', { ...cookies.sessionToken.options, maxAge: 0 })
      }
    } catch (error) {
      console.error('SESSION_ERROR', error)
    }
  }

  res.setHeader('Content-Type', 'application/json')
  res.json(response)
  return done()
}
