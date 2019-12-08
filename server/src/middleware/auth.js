const { Token } = require('../models')

const auth = {}

async function getToken(tk) {
  if (!tk) {
    throw new Error('No Auth Token Provided')
  }
  const token = await Token.findOne({
    where: {
      token: tk,
    },
  })
  if (!token) {
    throw new Error('Invalid Token')
  }
  return token
}

// Admins are Level 0
auth.verifyAdmin = async (req, res, next) => {
  const tk = req.headers ? req.headers.authorization : null
  try {
    const token = await getToken(tk)
    if (token.level !== 0) {
      return res.status(401).send('You do not have the required access level to use this feature.')
    }
    return next()
  } catch (err) {
    return res.status(401).send(err.message)
  }
}
// Moderators are Level 1
auth.verifyModerator = async (req, res, next) => {
  const tk = req.headers ? req.headers.authorization : null
  try {
    const token = await getToken(tk)
    if (token.level > 1) {
      return res.status(401).send('You do not have the required access level to use this feature.')
    }
    return next()
  } catch (err) {
    return res.status(401).send(err.message)
  }
}

module.exports = auth
