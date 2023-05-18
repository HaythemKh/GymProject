import { Exclude } from 'class-transformer';
import {IsNotEmpty,IsEmail,IsOptional,IsNumber,IsDate,IsString,ArrayMinSize,IsPhoneNumber, IsBoolean, IsDateString, IsNumberString, ArrayMaxSize, IsArray, IsInt, Max, Min} from 'class-validator'

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

    @IsNumber()
    PricePerMonth : number;

    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(6)
    @IsInt({ each: true })
    @Min(0, { each: true })
    @Max(6, { each: true })
    daysOfWeek: number[];

    @IsNotEmpty()
    @IsString()
    StartDate : Date;

    @IsNotEmpty()
    @IsString()
    EndDate : Date;
}
