import { Exclude } from "class-transformer";
import {  IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";

export class CreateSubscriptionDto {
    
    @Exclude()
    _id : string;

    @IsNotEmpty()
    @IsString()
    Name : string;

    @IsNotEmpty()
    @IsString()
    Description : string;

    @IsNotEmpty()
    @IsNumber()
    PricePerMonth : number;

    @IsNotEmpty()
    @IsString()
    Gym : string;
}
