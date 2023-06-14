import { Module } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { Registration, RegistrationSchema } from 'src/Schemas/Registration.models';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseModule } from 'src/course/course.module';
import { UsersModule } from 'src/users/users.module';
import { GymModule } from 'src/gym/gym.module';
import { Course, CourseSchema } from 'src/Schemas/course.models';
import { Person, UserSchema } from 'src/Schemas/users.models';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports : [
    MongooseModule.forFeature([{name : Registration.name, schema:RegistrationSchema}]),
    MongooseModule.forFeature([{name : Course.name, schema:CourseSchema}]),
    MongooseModule.forFeature([{name : Person.name, schema:UserSchema}]),
    UsersModule,
    CourseModule,
    GymModule,
    NotificationModule
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService],
  exports : [RegistrationService]
})
export class RegistrationModule {}
