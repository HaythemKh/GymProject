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

  @SubscribeMessage('message')
    sendNotificationToClient(clientId: string, notification : any) {
      this.server/*.to(clientId)*/.emit('notification', notification);
    }
}
