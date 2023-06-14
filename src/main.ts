import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { ValidationPipe,ValidationError } from '@nestjs/common';
import { ValidationException, ValidationFilter } from './util/filter.validation';
import { WinstonModule } from 'nest-winston';
import { winstonLogger } from './winston.logger';
import * as admin from 'firebase-admin';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

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
  const corsOptions: ServerOptions = {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    path: '',
    serveClient: false,
    adapter: undefined,
    parser: undefined,
    connectTimeout: 0,
    connectionStateRecovery: {
      maxDisconnectionDuration: 0,
      skipMiddlewares: false
    },
    cleanupEmptyChildNamespaces: false
  };
  app.use(cors());
  app.useWebSocketAdapter(new IoAdapter(app,corsOptions));
  const port = process.env.PORT;
  await app.listen(port);
}
bootstrap();
