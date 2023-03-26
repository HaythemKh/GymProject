import { Module } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';
import { Equipment, EquipmentSchema } from 'src/Schemas/equipment.models';
import { MongooseModule } from '@nestjs/mongoose';
import { GymModule } from 'src/gym/gym.module';

@Module({
  imports : [
    MongooseModule.forFeature([{name : Equipment.name, schema:EquipmentSchema}]),
    GymModule,
  ],
  controllers: [EquipmentController],
  providers: [EquipmentService],
  exports : [EquipmentService]
})
export class EquipmentModule {}
