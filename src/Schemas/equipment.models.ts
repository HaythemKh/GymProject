import {Prop,Schema,SchemaFactory}  from '@nestjs/mongoose';
import {Document}  from 'mongoose';

export type EquipmentDocument = Equipment & Document;

@Schema({ collection: 'equipment' })
export class Equipment {

    @Prop({ required:true})
    Name : string;

    @Prop({ required:true})
    Description : string;

    @Prop({ required:true, default: true})
    Availability : boolean;

    @Prop({ required:true})
    Gym : string;
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment)