import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation, ReservationSchema } from 'src/Schemas/reservation.models';
import { MongooseModule } from '@nestjs/mongoose';
import { EquipmentModule } from 'src/equipment/equipment.module';
import { UsersModule } from 'src/users/users.module';
import { GymModule } from 'src/gym/gym.module';
import { Equipment, EquipmentSchema } from 'src/Schemas/equipment.models';
import { Person, UserSchema } from 'src/Schemas/users.models';
import { GymConfigModule } from 'src/gym-config/gym-config.module';
import { SubsMembershipModule } from 'src/subs-membership/subs-membership.module';
import { Course, CourseSchema } from 'src/Schemas/course.models';
import { SubsMembership, SubsMembershipSchema } from 'src/Schemas/subsmembership.models';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports : [
    MongooseModule.forFeature([{name : Reservation.name, schema:ReservationSchema}]),
    MongooseModule.forFeature([{name : Equipment.name, schema:EquipmentSchema}]),
    MongooseModule.forFeature([{name : Person.name, schema:UserSchema}]),
    MongooseModule.forFeature([{name : Course.name, schema:CourseSchema}]),
    EquipmentModule,
    UsersModule,
    GymModule,
    GymConfigModule,
    SubsMembershipModule,
    NotificationModule
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports : [ReservationService]
})
export class ReservationModule {}
