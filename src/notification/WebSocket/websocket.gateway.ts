import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';

@WebSocketGateway()
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    // Handle connection logic here
  }

  handleDisconnect(client: any) {
    // Handle disconnection logic here
  }
}
