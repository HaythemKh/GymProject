import { Exclude } from "class-transformer";
import { IsDecimal, IsNotEmpty, IsNumber, IsNumberString, IsString, MaxLength, MinLength, Validator,IsOptional } from "class-validator";


export class UpdateGymConfigDto{

    @Exclude()
    _id : string;

    @IsOptional()
    @IsString()
    OpeningTime : Date;

    @IsOptional()
    @IsString()
    ClosingTime : Date;

    @IsOptional()
    @IsString()
    Logo : string;

    @IsOptional()
    @IsString()
    Color : string;
}
