import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { SocketGateway } from 'src/socket/socket.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from 'src/Schemas/notification.models';

@Module({
  imports : [MongooseModule.forFeature([{name : Notification.name, schema:NotificationSchema}]),
],
  providers: [NotificationService,SocketGateway],
  controllers: [NotificationController],
  exports : [NotificationService]
})
export class NotificationModule {}
