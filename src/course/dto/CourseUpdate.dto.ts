import { Exclude } from "class-transformer";
import { IsOptional, IsString, IsNumber } from "class-validator";

export class UpdateDtoCourse {
    @Exclude()
    _id : string;

    @IsOptional()
    @IsString()
    Name : string;

    @IsOptional()
    @IsString()
    Trainer : string;

    @IsOptional()
    @IsString()
    Description : string;

    @IsOptional()
    @IsNumber()
    Capacity : number;

    @IsOptional()
    @IsNumber()
    PricePerMonth : number;

    @IsOptional()
    @IsString()
    Gym : string;
}