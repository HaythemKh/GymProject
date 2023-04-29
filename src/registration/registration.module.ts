import { Module } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { Registration, RegistrationSchema } from 'src/Schemas/Registration.models';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseModule } from 'src/course/course.module';
import { UsersModule } from 'src/users/users.module';
import { GymModule } from 'src/gym/gym.module';

@Module({
  imports : [
    MongooseModule.forFeature([{name : Registration.name, schema:RegistrationSchema}]),
    UsersModule,
    CourseModule,
    GymModule
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService],
  exports : [RegistrationService]
})
export class RegistrationModule {}
