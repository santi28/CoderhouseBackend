import winston from 'winston'

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2
  }
}

const logger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({
      level: 'info'
    })
  ]
})

export const loggerMiddleware = (req, res, next) => {
  req.logger = logger
  next()
}
