const {
  createToken, revokeToken,
} = require('../controllers')

const { verifyAdmin } = require('../middleware/auth')

module.exports = (app) => {
  app.post('/api/v1/token/create', verifyAdmin, createToken)
  app.put('/api/v1/token/revoke', verifyAdmin, revokeToken)
}
