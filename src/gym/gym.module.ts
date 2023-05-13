import { Module } from '@nestjs/common';
import { GymService } from './gym.service';
import { GymController } from './gym.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Gym, GymSchema } from 'src/Schemas/gym.models';
import { Person, UserSchema } from 'src/Schemas/users.models';
import { Subscription, SubscriptionSchema } from 'src/Schemas/subscription.models';
import { GymConfigModule } from 'src/gym-config/gym-config.module';
import { Equipment, EquipmentSchema } from 'src/Schemas/equipment.models';
import { Course, CourseSchema } from 'src/Schemas/course.models';
import { SubsMembership, SubsMembershipSchema } from 'src/Schemas/subsmembership.models';
import { Registration, RegistrationSchema } from 'src/Schemas/Registration.models';

@Module({
  imports : [
    MongooseModule.forFeature([{name : Gym.name, schema:GymSchema}]),
    MongooseModule.forFeature([{name : Person.name, schema:UserSchema}]),
    MongooseModule.forFeature([{name : Subscription.name, schema:SubscriptionSchema}]),
    MongooseModule.forFeature([{name : Equipment.name, schema:EquipmentSchema}]),
    MongooseModule.forFeature([{name : Course.name, schema:CourseSchema}]),
    MongooseModule.forFeature([{name : SubsMembership.name, schema:SubsMembershipSchema}]),
    MongooseModule.forFeature([{name : Registration.name, schema:RegistrationSchema}]),
    GymConfigModule
  ],
  controllers: [GymController],
  providers: [GymService],
  exports: [GymService],
})
export class GymModule {}
