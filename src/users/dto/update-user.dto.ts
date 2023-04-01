import { Exclude } from 'class-transformer';
import {IsEmail,IsOptional,IsNumber,IsString,IsPhoneNumber, IsNumberString } from 'class-validator'
export class UpdateUserDto{

    @Exclude()
    _id : string;
    
    @IsOptional()
    @IsString()
    firstName : string;

    @IsOptional()
    @IsString()
    lastName : string;

    @IsOptional()
    @IsEmail()
    @IsString()
    Email : string;

    @IsOptional()
    @IsString()
    Password : string;

    @IsOptional()
    @IsString()
    BirthDate : Date;

    @IsOptional()
    @IsString()
    Address : string;

    @IsPhoneNumber('TN')
    @IsOptional()
    @IsString()
    Phone : string;

    @IsNumber()
    @IsOptional()
    Height : number;
    
    @IsNumber()
    @IsOptional()
    Weight : number;
    
    @IsNumberString()
    @IsOptional()
    Salary : number;

    @Exclude()
    Gym : string;

}