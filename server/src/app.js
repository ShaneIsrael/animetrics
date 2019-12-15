const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const logger = require('./logger')

const app = express()
// const config = require('./config')

app.use(
  morgan('combined', {
    skip(req, res) {
      return res.statusCode < 500
    },
    stream: logger.errorStream,
  }),
)
if (process.env.NODE_ENV !== 'local') {
  app.use(
    morgan('combined', {
      skip(req, res) {
        return res.statusCode >= 500
      },
      stream: logger.infoStream,
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
require('./cron')

// Error Handler Middleware
app.use((err, req, res, next) => {
  logger.error(err)
  console.log(err)
  // This will get passed back to the user as a generic server error
  // message for caught errors.
  res.status(500).send('Unexpected server error occurred.')
  next()
})

// Start the server
app.listen(3001)
