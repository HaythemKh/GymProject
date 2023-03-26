import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation, ReservationSchema } from 'src/Schemas/reservation.models';
import { MongooseModule } from '@nestjs/mongoose';
import { EquipmentModule } from 'src/equipment/equipment.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports : [
    MongooseModule.forFeature([{name : Reservation.name, schema:ReservationSchema}]),
    EquipmentModule,
    UsersModule
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports : [ReservationService]
})
export class ReservationModule {}
