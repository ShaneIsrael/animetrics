const appRoot = require('app-root-path')
const Syslog = require('winston-syslog').Syslog
const { transports, createLogger, format } = require('winston')

const hostname = require('os').hostname()

// define the custom settings for each transport (file, console)
const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    timestamp: true,
  },
  errorFile: {
    level: 'error',
    filename: `${appRoot}/logs/error.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    timestamp: true,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    timestamp: true,
  },
}

const enumerateErrorFormat = format(info => {
  if (info.message instanceof Error) {
    info.message = Object.assign({
      message: info.message.message,
      stack: info.message.stack
    }, info.message);
  }

  if (info instanceof Error) {
    return Object.assign({
      message: info.message,
      stack: info.stack
    }, info);
  }

  return info;
})

// instantiate a new Winston Logger with the settings defined above
const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    enumerateErrorFormat(),
    format.json(),
  ),
  transports: [
    new transports.Console(options.console),
    new Syslog({
      host: 'logs5.papertrailapp.com',
      port: 28660,
      app_name: 'animetrics',
      localhost: hostname,
      colorize: true,
      timestamp: true,
      handleExceptions: true,
      level: 'info'
    })
  ],
  exitOnError: false, // do not exit on handled exceptions
})

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
}

module.exports = logger
