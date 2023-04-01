import { Exclude } from 'class-transformer';
import {IsNotEmpty,IsEmail,IsOptional,IsNumber,IsDate,IsString,ArrayMinSize,IsPhoneNumber, IsBoolean, IsDateString} from 'class-validator'

export class CreateCourseDto {
    @Exclude()
    _id : string;

    @IsNotEmpty()
    @IsString()
    Name : string;

    @IsNotEmpty()
    @IsString()
    Trainer : string;

    @IsNotEmpty()
    @IsString()
    Description : string;

    @IsNotEmpty()
    @IsNumber()
    Capacity : number;

    @IsNotEmpty()
    @IsString()
    Gym : string;

    @IsNotEmpty()
    @IsDateString()
    StartDate : string;

    @IsNotEmpty()
    @IsDateString()
    EndDate : string;
}
