import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { GymModule } from './gym/gym.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { GymConfigModule } from './gym-config/gym-config.module';
import { EquipmentModule } from './equipment/equipment.module';
import { ReservationModule } from './reservation/reservation.module';
import { CourseModule } from './course/course.module';
import { AuthModule } from './auth/auth.module';
import { RegistrationModule } from './registration/registration.module';
import { SubsMembershipModule } from './subs-membership/subs-membership.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    GymModule,
    SubscriptionModule,
    GymConfigModule,
    EquipmentModule,
    ReservationModule,
    CourseModule,
    AuthModule,
    RegistrationModule,
    SubsMembershipModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
