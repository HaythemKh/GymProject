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
import { SendEmailModule } from './send-email/send-email.module';
import { ReportModule } from './report/report.module';
import { WinstonModule } from 'nest-winston';
import { NotificationModule } from './notification/notification.module';
import { WebsocketModule } from './websocket/websocket.module';
import { SocketGateway } from './socket/socket.gateway';

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
    SubsMembershipModule,
    SendEmailModule,
    ReportModule,
    NotificationModule,
    WebsocketModule,
    ],
  controllers: [],
  providers: [SocketGateway],
  exports : []
})
export class AppModule {}
