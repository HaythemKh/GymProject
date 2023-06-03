import { createLogger, format, transports  } from 'winston';
import { WinstonModuleOptions, utilities } from 'nest-winston';

const winstonConfig: WinstonModuleOptions = {
  level: 'info',
  format: format.combine(
    format.timestamp(),
    utilities.format.nestLike(),
  ),
  transports: [
    new transports.Console(),
  ],
};
export const winstonLogger = createLogger(winstonConfig);



