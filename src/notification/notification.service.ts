import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import {ServiceAccount} from 'firebase-admin'
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import * as serviceAccount from '../../nestjs-push-notification.json';
@Injectable()
export class NotificationService {

    // constructor(){
    //     // admin.initializeApp({
    //     //     credential: admin.credential.cert(serviceAccount as ServiceAccount),
    //     //   });
    // }
    constructor(private readonly webSocketGateway: WebsocketGateway) {}

    async SendNotification(id : string, notification : any){
        this.webSocketGateway.sendNotificationToClient(id,notification);
    }
    async SendNotifications(UsersId: string[],notification : any){
        for(const user of UsersId)
        this.webSocketGateway.sendNotificationToClient(user,notification);
    }
}
