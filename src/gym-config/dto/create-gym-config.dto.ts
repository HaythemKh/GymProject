import { Exclude } from "class-transformer";
import { IsDateString, IsDecimal, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Matches, MaxLength, MinLength, Validator, } from "class-validator";

export class CreateGymConfigDto {
    
    @IsNotEmpty()
    @IsDateString()
    OpeningTime : Date;

    @IsNotEmpty()
    @IsDateString()
    ClosingTime : Date;

    @IsNotEmpty()
    @IsString()
    Logo : string;

    @IsNotEmpty()
    @IsString()
    Color : string;
}
