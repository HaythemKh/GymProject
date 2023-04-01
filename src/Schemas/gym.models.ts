import {Prop,Schema,SchemaFactory}  from '@nestjs/mongoose';
import {Document, Types}  from 'mongoose';

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

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Person' }], default: [] })
    users : string[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Subscription' }], default: [] })
    subscriptions : string[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Equipment' }], default: [] })
    equipments : string[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Course' }], default: [] })
    courses : string[];



}

export const GymSchema = SchemaFactory.createForClass(Gym)