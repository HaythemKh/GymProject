import { Exclude } from "class-transformer";
import {  IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateReservationDto{

    @Exclude()
    _id : string;

    @IsOptional()
    @IsString()
    User : string;

    @IsOptional()
    @IsString()
    Equipment : string;

    @IsOptional()
    @IsDateString()
    Start_time : string;

    @IsOptional()
    @IsDateString()
    End_time : string;
}
