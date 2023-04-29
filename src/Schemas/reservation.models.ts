import {Prop,Schema,SchemaFactory}  from '@nestjs/mongoose';
import mongoose, {Document}  from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema({ collection: 'reservation' })
export class Reservation {

    @Prop({ required:true , type: mongoose.Schema.Types.ObjectId, ref: 'users'})
    User : string;

    @Prop({ required:true, type: mongoose.Schema.Types.ObjectId, ref: 'equipment'})
    Equipment : string;

    @Prop({ required:true})
    Start_time : Date;

    @Prop({ required:true})
    End_time : Date;

}
export const ReservationSchema = SchemaFactory.createForClass(Reservation)