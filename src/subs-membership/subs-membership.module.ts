import { Module } from '@nestjs/common';
import { SubsMembershipService } from './subs-membership.service';
import { SubsMembershipController } from './subs-membership.controller';
import { SubsMembership, SubsMembershipSchema } from 'src/Schemas/subsmembership.models';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseModule } from 'src/course/course.module';
import { GymModule } from 'src/gym/gym.module';
import { UsersModule } from 'src/users/users.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { Person, UserSchema } from 'src/Schemas/users.models';
import { Subscription, SubscriptionSchema } from 'src/Schemas/subscription.models';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports : [
    MongooseModule.forFeature([{name : SubsMembership.name, schema:SubsMembershipSchema}]),
    MongooseModule.forFeature([{name : Person.name, schema:UserSchema}]),
    MongooseModule.forFeature([{name : Subscription.name, schema:SubscriptionSchema}]),
    UsersModule,
    SubscriptionModule,
    GymModule,
    NotificationModule
  ],
  controllers: [SubsMembershipController],
  providers: [SubsMembershipService],
  exports : [SubsMembershipService]
})
export class SubsMembershipModule {}
