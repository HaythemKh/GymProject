import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription, SubscriptionSchema } from 'src/Schemas/subscription.models';
import { GymModule } from 'src/gym/gym.module';
import { SubsMembership, SubsMembershipSchema } from 'src/Schemas/subsmembership.models';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports : [
    MongooseModule.forFeature([{name : Subscription.name, schema:SubscriptionSchema}]),
    GymModule,
    MongooseModule.forFeature([{name : SubsMembership.name, schema:SubsMembershipSchema}]),
    NotificationModule
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports : [SubscriptionService]
})
export class SubscriptionModule {}
