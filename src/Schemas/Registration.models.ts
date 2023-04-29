import {Prop,Schema,SchemaFactory}  from '@nestjs/mongoose';
import mongoose, {Document}  from 'mongoose';

export type RegistrationDocument = Registration & Document;

@Schema({ collection: 'registration',timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})
export class Registration {

    @Prop({ required:true, type: mongoose.Schema.Types.ObjectId, ref: 'users' })
    Member : string;

    @Prop({ required:true, type: mongoose.Schema.Types.ObjectId, ref: 'course'})
    Course : string;

    @Prop({ required:true})
    IsActive : Boolean;

    @Prop({ required:true})
    Price : number;

    @Prop({required:true})
    Duration : number;

}
export const RegistrationSchema = SchemaFactory.createForClass(Registration)