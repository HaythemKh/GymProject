import { createLogger, format, transports } from 'winston';

export const winstonLogger = createLogger({
  level: 'info',
  transports: [
    new transports.Console(),
  ],
  format: format.combine(
    format.timestamp(),
    format.prettyPrint()
  ),
});




