import {Prop,Schema,SchemaFactory}  from '@nestjs/mongoose';
import mongoose, {Document}  from 'mongoose';

export type SubsMembershipDocument = SubsMembership & Document;

@Schema({ collection: 'subsMembership',timestamps: {updatedAt: 'updated_at' }})
export class SubsMembership {

    @Prop({ required:true, type: mongoose.Schema.Types.ObjectId, ref: 'users' })
    Member : string;

    @Prop({ required:true, type: mongoose.Schema.Types.ObjectId, ref: 'subscription'})
    Subscription : string;

    @Prop({ required:true})
    IsActive : Boolean;

    @Prop({required:true})
    Price : number;

    @Prop({required:true})
    Duration : number;

    @Prop({required:false,immutable : true, default : Date.now})
    createdAt : Date;

}
export const SubsMembershipSchema = SchemaFactory.createForClass(SubsMembership)