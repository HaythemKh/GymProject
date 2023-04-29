import { Module } from '@nestjs/common';
import { SubsMembershipService } from './subs-membership.service';
import { SubsMembershipController } from './subs-membership.controller';
import { SubsMembership, SubsMembershipSchema } from 'src/Schemas/subsmembership.models';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseModule } from 'src/course/course.module';
import { GymModule } from 'src/gym/gym.module';
import { UsersModule } from 'src/users/users.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';

@Module({
  imports : [
    MongooseModule.forFeature([{name : SubsMembership.name, schema:SubsMembershipSchema}]),
    UsersModule,
    SubscriptionModule,
    GymModule
  ],
  controllers: [SubsMembershipController],
  providers: [SubsMembershipService],
  exports : [SubsMembershipService]
})
export class SubsMembershipModule {}
