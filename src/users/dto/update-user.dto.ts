import { Exclude } from 'class-transformer';
import {IsEmail,IsOptional,IsNumber,IsString,IsPhoneNumber, IsNumberString, IsDateString, Max, Min, Length } from 'class-validator'
import { Role } from 'src/Schemas/users.models';
export class UpdateUserDto{

    @Exclude()
    _id : string;

    @Exclude()
    Role : string;
    
    @IsOptional()
    @Length(3, 30)
    firstName : string;

    @IsOptional()
    @Length(3, 30)
    lastName : string;

    @IsOptional()
    @IsEmail()
    Email : string;

    @IsOptional()
    @Length(8, 20)
    Password : string;

    @IsOptional()
    @IsDateString()
    BirthDate : Date;

    @IsOptional()
    @Length(5, 50)
    Address : string;

    @IsOptional()
    @IsPhoneNumber('TN')
    Phone : string;

    @IsOptional()
    @IsNumber()
    @Min(140)
    @Max(300)
    Height : number;
    
    @IsOptional()
    @IsNumber()
    @Min(40)
    @Max(300)
    Weight : number;
    
    @IsOptional()
    @IsNumber()
    @Min(500)
    @Max(5000)
    Salary : number;

    @Exclude()
    Gym : string;

}