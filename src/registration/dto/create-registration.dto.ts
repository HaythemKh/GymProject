import { Exclude } from "class-transformer";
import {  IsBooleanString, IsDateString, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateRegistrationDto {

    @Exclude()
    _id : string;

    @IsOptional()
    @IsString()
    Member : string;

    @IsNotEmpty()
    @IsString()
    Course : string;

    @IsNotEmpty()
    @IsBooleanString()
    IsActive : Boolean;

    @IsNotEmpty()
    @IsNumber()
    Duration : number;

}
