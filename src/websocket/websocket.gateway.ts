import { IoAdapter } from '@nestjs/platform-socket.io';
import {WebSocketGateway,SubscribeMessage,WebSocketServer,OnGatewayConnection,OnGatewayDisconnect,} from '@nestjs/websockets';
  import { Server, ServerOptions, Socket } from 'socket.io';

  
  @WebSocketGateway()
  export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    connectedClients: Map<string, Socket> = new Map();

    handleConnection(client: Socket) {
      console.log('Client connected:', client.id);
      const userId = client.handshake.query.userId; // Assuming you pass the userId during connection

    }
  
    handleDisconnect(client: Socket) {
      console.log('Client disconnected:', client.id);
    }
  
    @SubscribeMessage('message')
    sendNotificationToClient(clientId: string, notification : any) : boolean {
      this.server/*.to(clientId)*/.emit('notification', notification);

      return true;
    }
  }


  export class CustomSocketIoAdapter extends IoAdapter {
    createIOServer(port: number, options?: ServerOptions): any {
      options = {
        ...options,
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
        },
      };
      return super.createIOServer(port, options);
    }
  }