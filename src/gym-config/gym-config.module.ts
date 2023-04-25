import { Module } from '@nestjs/common';
import { GymConfigService } from './gym-config.service';
import { GymConfigController } from './gym-config.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GymConfig, GymConfigSchema } from 'src/Schemas/gymConfig.models';
import { Gym, GymSchema } from 'src/Schemas/gym.models';

@Module({
  imports : [
    MongooseModule.forFeature([{name : GymConfig.name, schema:GymConfigSchema}]),
    MongooseModule.forFeature([{name : Gym.name, schema:GymSchema}])
  ],
  controllers: [GymConfigController],
  providers: [GymConfigService],
  exports : [GymConfigService],
})
export class GymConfigModule {}
