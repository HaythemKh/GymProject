import { Exclude } from "class-transformer";
import { IsOptional, IsString, IsNumber, ArrayMaxSize, ArrayMinSize, IsArray, IsInt, Max, Min, IsNotEmpty } from "class-validator";

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
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(6)
    @IsInt({ each: true })
    @Min(0, { each: true })
    @Max(6, { each: true })
    daysOfWeek: number[];

    @IsOptional()
    @IsString({ each: true })
    @ArrayMinSize(0)
    Equipments : string[];

    @IsOptional()
    @IsString()
    StartDate : Date;

    @IsOptional()
    @IsString()
    EndDate : Date;

    @IsOptional()
    @IsString()
    Gym : string;
}