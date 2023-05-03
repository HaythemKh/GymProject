
import {Role} from "src/Schemas/users.models"
import { Gender } from 'src/Schemas/users.models';
import {IsNotEmpty,IsEmail,IsOptional,IsNumber,IsDate,IsString,IsEnum,IsPhoneNumber, IsDateString, IsNumberString } from 'class-validator'
import { Exclude, plainToClass } from 'class-transformer';
export class CreateUserDto {

    @Exclude()
    _id : string;

    @IsNotEmpty()
    @IsString()
    firstName : string;

    @IsNotEmpty()
    @IsString()
    lastName : string;

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    Email : string;

    @IsNotEmpty()
    @IsString()
    Password : string;

    @IsNotEmpty()
    @IsEnum(Gender)
    Gender : Gender;
    
    @IsNotEmpty()
    @IsDateString()
    BirthDate : Date;

    @IsNotEmpty()
    @IsString()
    Address : string;


    @IsPhoneNumber('TN')
    @IsNotEmpty()
    @IsString()
    Phone : string;

    
    @IsNumber()
    @IsNotEmpty()
    Height : number;
    
    @IsNumber()
    @IsNotEmpty()
    Weight : number;
    
    @IsNumber()
    @IsOptional()
    Salary : number;

    @IsOptional()
    @IsString()
    Gym : string;

    @IsEnum(Role)
    @IsNotEmpty()
    Role: Role;
}
