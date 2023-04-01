import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GymModule } from 'src/gym/gym.module';
import { Course, CourseSchema } from 'src/Schemas/course.models';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports : [
    MongooseModule.forFeature([{name : Course.name, schema:CourseSchema}]),
    GymModule,
    UsersModule
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports : [CourseService]
})
export class CourseModule {}
