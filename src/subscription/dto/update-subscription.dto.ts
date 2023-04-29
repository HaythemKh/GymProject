import { Exclude } from "class-transformer";
import { IsDecimal, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";


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
    PricePerMonth : number;

    @Exclude()
    Gym : string;
}
