import {Prop,Schema,SchemaFactory}  from '@nestjs/mongoose';
import {Document}  from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema({ collection: 'reservation' })
export class Reservation {

    @Prop({ required:true})
    User : string;

    @Prop({ required:true})
    Equipment : string;

    @Prop({ required:true})
    Start_time : Date;

    @Prop({ required:true})
    End_time : Date;

}
export const ReservationSchema = SchemaFactory.createForClass(Reservation)