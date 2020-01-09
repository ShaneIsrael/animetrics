const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const logger = require('./logger')
const { environment } = require('./config')

const app = express()
app.set('trust proxy', true)
app.use(
  morgan('combined', {
    skip(req, res) {
      return res.statusCode < 500
    },
    stream: logger.stream,
  }),
)
if (environment !== 'dev') {
  app.use(
    morgan('combined', {
      skip(req, res) {
        return res.statusCode >= 500
      },
      stream: logger.stream,
    }),
  )
}

app.use(bodyParser.json())
app.use(cors())

// Routes
require('./routes/WeeklyResults')(app)
require('./routes/Details')(app)
require('./routes/Override')(app)
require('./routes/Token')(app)
require('./routes/Show')(app)
require('./routes/Asset')(app)
require('./routes/Override')(app)
require('./routes/Discussion')(app)
require('./routes/Dialog')(app)
require('./routes/Season')(app)
require('./routes/TopTen')(app)
require('./cron')

// Error Handler Middleware
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.headers['x-real-ip']} - ${err.stack}`)
  // This will get passed back to the user as a generic server error
  // message for caught errors.
  res.status(500).send('Unexpected server error occurred.')
  next()
})

// Start the server
app.listen(3001)
