import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { WebsocketModule } from 'src/websocket/websocket.module';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { SocketGateway } from 'src/socket/socket.gateway';
@Module({
  imports : [WebsocketModule],
  providers: [NotificationService,SocketGateway],
  controllers: [NotificationController],
  exports : [NotificationService]
})
export class NotificationModule {}
