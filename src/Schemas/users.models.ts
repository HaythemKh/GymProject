import {Prop,Schema,SchemaFactory}  from '@nestjs/mongoose';
import {Document}  from 'mongoose';

export type UserDocument = Person & Document;

 export enum Role {
    ADMIN = 'admin',
    TRAINER = 'trainer',
    MEMBER = 'member',
  }

  export enum Gender {
    MEN = 'men',
    WOMEN = 'women',
  }
  

@Schema({ collection: 'users' })
export class Person {

    @Prop({ required:true})
    firstName : string;

    @Prop({ required:true})
    lastName : string;

    @Prop({ required:true, unique: true})
    Email : string;

    @Prop({ required:true})
    Password : string;
  
    @Prop({ required: true})
    Gender : Gender;

    @Prop({ required:true, get: formatDate, set: parseDate})
    BirthDate : Date;

    @Prop({ required:true})
    Address : string;

    @Prop({ required:true, unique: true})
    Phone : string;

    @Prop({ required:false})
    Height : number;

    @Prop({ required:false})
    Weight : number;
    
    @Prop({ required:false})
    Salary : number;

    @Prop({ required:true})
    Gym : string;

    @Prop({ required: true, enum: Role})
    Role: Role;

    @Prop({required:false,immutable : true, default : Date.now})
    createdAt : Date;

    @Prop({required:false})
    resetPasswordToken: string;

    @Prop({required:false})
    resetPasswordExpires: Date;

    
}
function formatDate(date: Date) {
  return date.toISOString().substring(0, 10);
}

function parseDate(dateString: string) {
  return new Date(dateString);
}
export const UserSchema = SchemaFactory.createForClass(Person)