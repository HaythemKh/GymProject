import { Exclude } from "class-transformer";
import {  IsBooleanString, IsDate, IsDateString, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateSubsMembershipDto {

    @Exclude()
    _id : string;

    @IsOptional()
    @IsString()
    Member : string;

    @IsNotEmpty()
    @IsString()
    Subscription : string;

    @IsNotEmpty()
    @IsBooleanString()
    IsActive : Boolean;

    @IsNotEmpty()
    @IsNumber()
    Price : number;

    @IsNotEmpty()
    @IsNumber()
    Duration : number;

    @IsOptional()
    @IsDate()
    createdAt : Date;
}
