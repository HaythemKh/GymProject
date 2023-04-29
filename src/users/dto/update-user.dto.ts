import { Exclude } from 'class-transformer';
import {IsEmail,IsOptional,IsNumber,IsString,IsPhoneNumber, IsNumberString } from 'class-validator'
import { Role } from 'src/Schemas/users.models';
export class UpdateUserDto{

    @Exclude()
    _id : string;

    @Exclude()
    Role : string;
    
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

    @IsOptional()
    @IsNumberString()
    Height : number;
    
    @IsOptional()
    @IsNumberString()
    Weight : number;
    
    @IsNumberString()
    @IsOptional()
    Salary : number;

    @Exclude()
    Gym : string;

}