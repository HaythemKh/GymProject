import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { ValidationPipe,ValidationError } from '@nestjs/common';
import { ValidationException, ValidationFilter } from './util/filter.validation';
import { WinstonModule } from 'nest-winston';
import { winstonLogger } from './winston.logger';
import * as admin from 'firebase-admin';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule/*,{logger: WinstonModule.createLogger(winstonLogger)}*/);
  app.setGlobalPrefix('/api');

  app.useGlobalFilters(new ValidationFilter());

  app.useGlobalPipes(new ValidationPipe({
    skipMissingProperties : false,
    exceptionFactory : (errors : ValidationError[]) => {
      const errMsg = {};
      errors.forEach((err) => {
        errMsg[err.property] = [...Object.values(err.constraints)];
      });
      return new ValidationException(errMsg);
    },
  }),
  );
  app.use(cors());
  app.useWebSocketAdapter(new IoAdapter(app));
  const port = process.env.PORT;
  await app.listen(port);
}
bootstrap();
