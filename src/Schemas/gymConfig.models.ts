import {Prop,Schema,SchemaFactory}  from '@nestjs/mongoose';
import mongoose, {Document}  from 'mongoose';

export type GymConfigDocument = GymConfig & Document;

@Schema({ collection: 'gymConfig' })
export class GymConfig {

    @Prop({ required:true,get: formatTime})
    OpeningTime : Date;

    @Prop({ required:true,get: formatTime})
    ClosingTime : Date;

    @Prop({ required:true})
    Logo : string;

    @Prop({ required:true})
    BackgroundLightMode : string;

    @Prop({ required:true})
    BackgroundDarkMode : string;

    @Prop({ required:true})
    TextColorLightMode : string;

    @Prop({ required:true})
    TextColorDarkMode : string;

    @Prop({ required:true})
    BtnColorLightMode : string;

    @Prop({ required:true})
    BtnColorDarkMode : string;
}


function formatTime(value: Date) {
    return value.toTimeString().substring(0, 5);
  }

export const GymConfigSchema = SchemaFactory.createForClass(GymConfig)