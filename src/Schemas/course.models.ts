import {Prop,Schema,SchemaFactory}  from '@nestjs/mongoose';
import mongoose, {Document}  from 'mongoose';

export type CourseDocument = Course & Document;

@Schema({ collection: 'course' })
export class Course {

    @Prop({ required:true})
    Name : string;

    @Prop({ required:true,type: mongoose.Schema.Types.ObjectId, ref: 'users'})
    Trainer : string;

    @Prop({ required:true})
    Capacity : number;

    @Prop({ required:true})
    Description : string;

    @Prop({ required:true,type: mongoose.Schema.Types.ObjectId, ref: 'gym'})
    Gym : string;

    @Prop({ required:true})
    PricePerMonth : number;

    @Prop({ required:false})
    StartDate : Date;

    @Prop({ required:false})
    EndDate : Date;

}

export const CourseSchema = SchemaFactory.createForClass(Course)