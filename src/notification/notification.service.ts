import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as admin from 'firebase-admin';
import {ServiceAccount} from 'firebase-admin'
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from 'src/Schemas/notification.models';
import { Role } from 'src/Schemas/users.models';
import { SocketGateway } from 'src/socket/socket.gateway';
import * as serviceAccount from '../../nestjs-push-notification.json';
import { notification } from './notification.model';
@Injectable()
export class NotificationService {

    // constructor(){
    //     // admin.initializeApp({
    //     //     credential: admin.credential.cert(serviceAccount as ServiceAccount),
    //     //   });
    // }
    constructor(@Inject(SocketGateway) private readonly webSocketGateway: SocketGateway,
    @InjectModel(Notification.name) private NotificationModel : Model<NotificationDocument>,
    ) {}

    async createNotification(notification : notification) : Promise<any>{
        const created = await this.NotificationModel.create(notification);
        if(created)
            await this.SendNotification(created);
    }

    async fetchGymNotifications(req : any) : Promise<any>{
        if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");
        const allNotifications = await this.NotificationModel.find({Gym : req.user.gym});
        return allNotifications;
    }
    async fetchUserNotifications(req : any) : Promise<any>{
        const allNotifications = await this.NotificationModel.find({User : req.user.sub});
        return allNotifications;
    }

    async SendNotification(notification : any){
        this.webSocketGateway.sendNotificationToClient(notification);
    }
    async SendNotifications(UsersId: string[],notification : any){
        for(const user of UsersId)
        this.webSocketGateway.sendNotificationToClient(notification);
    }
}
