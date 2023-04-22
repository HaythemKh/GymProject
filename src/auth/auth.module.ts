import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, UserSchema } from 'src/Schemas/users.models';
import { jwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports : [
    MongooseModule.forFeature([{name : Person.name, schema:UserSchema}]),
    UsersModule,
    JwtModule.register({
      secret : 'super-secret',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,jwtStrategy],
  exports : [AuthService,]
})
export class AuthModule {}
