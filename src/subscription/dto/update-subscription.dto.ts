import { Exclude } from "class-transformer";
import { IsDecimal, IsNumber, IsOptional, IsString } from "class-validator";


export class UpdateSubscriptionDto{

    @Exclude()
    _id : string;

    @IsOptional()
    @IsString()
    Name : string;

    @IsOptional()
    @IsString()
    Description : string;


    @IsOptional()
    @IsNumber()
    @IsDecimal()
    Price : number;


    @IsOptional()
    @IsNumber()
    Duration : number;

    @Exclude()
    Gym : string;
}
