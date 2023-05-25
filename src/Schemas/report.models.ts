import {Prop,Schema,SchemaFactory}  from '@nestjs/mongoose';
import mongoose, {Document}  from 'mongoose';

export type ReportDocument = Report & Document;

@Schema({ collection: 'reports' })
export class Report {

    @Prop({ required:true})
    UserID : string;

    @Prop({ required:true})
    DateTime : Date;

    @Prop({ required:true})
    Description : string;

}

export const ReportSchema = SchemaFactory.createForClass(Report)