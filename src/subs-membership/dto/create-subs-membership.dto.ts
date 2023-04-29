import { Exclude } from "class-transformer";
import {  IsBooleanString, IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSubsMembershipDto {

    @Exclude()
    _id : string;

    @IsNotEmpty()
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
}
