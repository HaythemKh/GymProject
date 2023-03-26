import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription, SubscriptionSchema } from 'src/Schemas/subscription.models';
import { GymModule } from 'src/gym/gym.module';

@Module({
  imports : [
    MongooseModule.forFeature([{name : Subscription.name, schema:SubscriptionSchema}]),
    GymModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports : [SubscriptionService]
})
export class SubscriptionModule {}
