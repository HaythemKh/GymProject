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

@Module({
  imports : [
    MongooseModule.forFeature([{name : Reservation.name, schema:ReservationSchema}]),
    MongooseModule.forFeature([{name : Equipment.name, schema:EquipmentSchema}]),
    MongooseModule.forFeature([{name : Person.name, schema:UserSchema}]),
    EquipmentModule,
    UsersModule,
    GymModule
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports : [ReservationService]
})
export class ReservationModule {}
