import { Controller,Get,Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
constructor(private readonly notificationService: NotificationService) {}

@UseGuards(AuthGuard("jwt"))
@Get("AdminsNotifications")
async AdminsNotifications(@Request() req:any) :Promise<any[]>{
  return await this.notificationService.fetchGymNotifications(req);
}

@UseGuards(AuthGuard('jwt'))
@Get("UserNotifications")
async UserNotifications(@Request() req : any) : Promise<any[]> {
    return await this.notificationService.fetchUserNotifications(req);
}

}
