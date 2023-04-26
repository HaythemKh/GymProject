import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation, ReservationSchema } from 'src/Schemas/reservation.models';
import { MongooseModule } from '@nestjs/mongoose';
import { EquipmentModule } from 'src/equipment/equipment.module';
import { UsersModule } from 'src/users/users.module';
import { GymModule } from 'src/gym/gym.module';

@Module({
  imports : [
    MongooseModule.forFeature([{name : Reservation.name, schema:ReservationSchema}]),
    EquipmentModule,
    UsersModule,
    GymModule
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports : [ReservationService]
})
export class ReservationModule {}
