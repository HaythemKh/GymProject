import { Exclude } from 'class-transformer';
import {IsNotEmpty,IsEmail,IsOptional,IsNumber,IsDate,IsString,ArrayMinSize,IsPhoneNumber, IsBoolean, IsDateString, IsNumberString} from 'class-validator'

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

    @IsOptional()
    @IsString()
    Gym : string;

    @IsNumberString()
    PricePerMonth : number;

    // @IsOptional()
    // @IsDateString()
    // StartDate : string;

    // @IsOptional()
    // @IsDateString()
    // EndDate : string;
}
