import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import {ServiceAccount} from 'firebase-admin'
import * as serviceAccount from '../../nestjs-push-notification.json';
@Injectable()
export class NotificationService {

    constructor(){
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as ServiceAccount),
          });
    }

    async SendNotification(deviceTokens: string[], title: string, body: string){
        const message = {
            tokens : deviceTokens,
            notification: {
                title : title,
                body : body
            },
        };

        try {
            const response = await admin.messaging().sendMulticast(message);
            console.log('Successfully sent notifications:', response);
          } catch (error) {
            console.error('Error sending notifications:', error);
          }
    }
    async SendNotifications(){

    }
}
