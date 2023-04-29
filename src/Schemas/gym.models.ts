import {Prop,Schema,SchemaFactory}  from '@nestjs/mongoose';
import mongoose, {Document, Types}  from 'mongoose';

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

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }], default: [] })
    users : string[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'subscription' }], default: [] })
    subscriptions : string[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'equipment' }], default: [] })
    equipments : string[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'course' }], default: [] })
    courses : string[];



}

export const GymSchema = SchemaFactory.createForClass(Gym)