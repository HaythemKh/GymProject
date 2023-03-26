import {Prop,Schema,SchemaFactory}  from '@nestjs/mongoose';
import {Document}  from 'mongoose';

export type GymDocument = Gym & Document;

@Schema({ collection: 'gym' })
export class Gym {

    @Prop({ required:true})
    fullName : string;

    @Prop({ required:true})
    address : string;

    @Prop({ required:true, unique: true})
    Email : string;

    @Prop({ required:true})
    phone : string;

    @Prop({ required:true, unique: true})
    gymConfig : string;

    @Prop({ required:true})
    users : string[];

    @Prop({ required:true})
    subscriptions : string[];

    @Prop({ required:true})
    equipments : string[];



}

export const GymSchema = SchemaFactory.createForClass(Gym)