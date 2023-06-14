import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class SocketGateway {
  @WebSocketServer()
  server : Server;

  handleConnection(client : any){
    console.log('Client connected : ', client.id);
  }

  handleDisconnect(client : any){
    console.log('Client disconnected : ', client.id);
  }

  @SubscribeMessage('sendNotification')
    sendNotificationToClient(notification : any){
      this.server.emit('notification', notification);
    }

    @SubscribeMessage('sendNotifications')
    sendNotificationsToClients(notification : any){
      this.server.emit('notification', notification);
    }
}
