import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Person, UserSchema } from 'src/Schemas/users.models';
import { MongooseModule } from '@nestjs/mongoose';
import { GymModule } from 'src/gym/gym.module';

@Module({
  imports : [
    MongooseModule.forFeature([{name : Person.name, schema:UserSchema}]),
    GymModule
],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
