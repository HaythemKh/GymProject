import { Exclude } from "class-transformer";
import {  IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateReservationDto {

    @Exclude()
    _id : string;

    @IsOptional()
    @IsString()
    User : string;

    @IsNotEmpty()
    @IsString()
    Equipment : string;
    

    @IsNotEmpty()
    @IsDateString()
    Start_time : string;

    @IsNotEmpty()
    @IsDateString()
    End_time : string;
}
