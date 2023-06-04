
import {Role} from "src/Schemas/users.models"
import { Gender } from 'src/Schemas/users.models';
import {IsNotEmpty,IsEmail,IsOptional,IsNumber,IsDate,IsString,IsEnum,IsPhoneNumber, IsDateString, IsNumberString, Min, Max, Length } from 'class-validator'
import { Exclude, plainToClass } from 'class-transformer';
export class CreateUserDto {

    @Exclude()
    _id : string;

    @IsNotEmpty()
    @Length(3, 30)
    firstName : string;

    @IsNotEmpty()
    @Length(3, 30)
    lastName : string;

    @IsNotEmpty()
    @IsEmail()
    Email : string;

    @IsNotEmpty()
    @Length(8, 20)
    Password : string;

    @IsNotEmpty()
    @IsEnum(Gender)
    Gender : Gender;
    
    @IsNotEmpty()
    @IsDateString()
    BirthDate : Date;

    @IsNotEmpty()
    @Length(5, 50)
    Address : string;

    @IsNotEmpty()
    @IsPhoneNumber('TN')
    Phone : string;
    
    @IsNotEmpty()
    @IsNumber()
    @Min(140)
    @Max(300)
    Height : number;
    
    @IsNotEmpty()
    @IsNumber()
    @Min(40)
    @Max(300)
    Weight : number;
    
    @IsOptional()
    @IsNumber()
    @Min(500)
    @Max(5000)
    Salary : number;

    @IsOptional()
    @IsString()
    Gym : string;

    @IsEnum(Role)
    @IsNotEmpty()
    Role: Role;
}
