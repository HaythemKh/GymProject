import {Prop,Schema,SchemaFactory}  from '@nestjs/mongoose';
import { ArrayMaxSize, ArrayMinSize } from 'class-validator';
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

    @ArrayMinSize(1)
    @ArrayMaxSize(7)
    @Prop({required:true,type: [{ type: Number }], enum: [0, 1, 2, 3, 4, 5, 6]})
    daysOfWeek : number[];

    @Prop({ required:true, get: formatTime})
    StartDate : Date;

    @Prop({ required:true,get: formatTime})
    EndDate : Date;

}

function formatTime(value: Date){
  if (!value) {
    return undefined;
  }
    return value.toTimeString().substring(0, 5);
  }


export const CourseSchema = SchemaFactory.createForClass(Course)