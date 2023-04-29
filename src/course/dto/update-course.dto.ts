import { Exclude } from 'class-transformer';
import {IsNotEmpty,IsEmail,IsOptional,IsNumber,IsDate,IsString,ArrayMinSize,IsPhoneNumber, IsBoolean, IsDateString} from 'class-validator'

export class UpdateCourseDto{

    @IsDateString()
    StartDate : string;

    @IsDateString()
    EndDate : string;
}
