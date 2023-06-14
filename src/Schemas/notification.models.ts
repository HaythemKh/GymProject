import {Prop,Schema,SchemaFactory}  from '@nestjs/mongoose';
import mongoose, {Document}  from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ collection: 'notification' })
export class Notification {

    @Prop({ required:false})
    User : string;

    @Prop({ required:false})
    Gym : string;

    @Prop({ required:true})
    Title : string;

    @Prop({ required:true})
    Message : string;

    @Prop({ default: () => new Date(Date.now() + 60 * 60 * 1000) })
    DateTime: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)