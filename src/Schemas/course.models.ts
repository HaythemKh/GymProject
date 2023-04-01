import {Prop,Schema,SchemaFactory}  from '@nestjs/mongoose';
import {Document}  from 'mongoose';

export type CourseDocument = Course & Document;

@Schema({ collection: 'course' })
export class Course {

    @Prop({ required:true})
    Name : string;

    @Prop({ required:true})
    Trainer : string;

    @Prop({ required:true})
    Capacity : number;

    @Prop({ required:true})
    Description : string;

    @Prop({ required:true})
    Gym : string;

    @Prop({ required:true})
    StartDate : Date;

    @Prop({ required:true})
    EndDate : Date;

}

export const CourseSchema = SchemaFactory.createForClass(Course)