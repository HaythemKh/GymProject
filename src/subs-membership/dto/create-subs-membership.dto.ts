import { Exclude } from "class-transformer";
import {  IsBooleanString, IsDateString, IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";

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
    @IsNumberString()
    Price : number;

    @IsNotEmpty()
    @IsNumberString()
    Duration : number;
}
