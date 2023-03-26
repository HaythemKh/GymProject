import {Prop,Schema,SchemaFactory}  from '@nestjs/mongoose';
import {Document}  from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema({ collection: 'subscription' })
export class Subscription {

    @Prop({ required:true})
    Name : string;

    @Prop({ required:true})
    Description : string;

    @Prop({ required:true})
    Price : number;

    @Prop({ required:true})
    Duration : number;

    @Prop({ required:true})
    Gym : string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription)