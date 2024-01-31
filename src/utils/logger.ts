import winston, { format } from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.align(),
    format.printf((info) => {
      return `${info.timestamp} - ${info.level}: ${
        info.message
      } ${JSON.stringify(info.metadata)}`;
    }),
    format.json(),
  ),
  defaultMeta: { service: 'crud-api' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}