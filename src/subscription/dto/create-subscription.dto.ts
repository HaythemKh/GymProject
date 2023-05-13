import { Exclude } from "class-transformer";
import {  IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

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

    @IsOptional()
    @IsString()
    Gym : string;
}
