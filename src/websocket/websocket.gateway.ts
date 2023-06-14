import {
    WebSocketGateway,
    SubscribeMessage,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import * as socketio from 'socket.io';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as http from 'http';

  
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

