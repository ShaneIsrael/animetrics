const { createLogger, format, transports } = require('winston')

const {
  combine, timestamp, json, prettyPrint,
} = format

const config = require('../config')

const logger = createLogger({
  format: config.environment === 'local'
    ? combine(prettyPrint({ colorize: true })) : combine(
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      json(),
    ),
  transports: [
    new transports.Console({
      handleExceptions: config.environment !== 'local',
      stringify: config.environment !== 'local',
      level: 'info',
    }),
  ],
  exitOnError: false,
})

logger.infoStream = {
  write: (message) => {
    logger.info(message)
  },
}
logger.errorStream = {
  write: (message) => {
    logger.error(message)
  },
}

logger.emitErrs = true

module.exports = logger
