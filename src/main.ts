import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { ValidationPipe,ValidationError } from '@nestjs/common';
import { ValidationException, ValidationFilter } from './util/filter.validation';
import { WinstonModule } from 'nest-winston';
import { winstonLogger } from './winston.logger';


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
  
  const port = process.env.PORT;
  await app.listen(port);
}
bootstrap();
