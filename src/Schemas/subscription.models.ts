import {Prop,Schema,SchemaFactory}  from '@nestjs/mongoose';
import mongoose, {Document}  from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema({ collection: 'subscription' })
export class Subscription {

    @Prop({ required:true})
    Name : string;

    @Prop({ required:true})
    Description : string;

    @Prop({ required:true})
    PricePerMonth : number;

    @Prop({ required:true,type: mongoose.Schema.Types.ObjectId, ref: 'gym'})
    Gym : string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription)