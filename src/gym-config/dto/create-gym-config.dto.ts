import { Exclude, Type } from "class-transformer";
import { IsDateString, IsDecimal, IsNotEmpty, IsNotEmptyObject, IsNumber, IsNumberString, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateNested, Validator, } from "class-validator";

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

    @IsString()
    @IsNotEmpty()
    @Matches(/^#([0-9a-fA-F]{3}){1,2}$/)
    BackgroundLightMode : string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^#([0-9a-fA-F]{3}){1,2}$/)
    BackgroundDarkMode : string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^#([0-9a-fA-F]{3}){1,2}$/)
    TextColorLightMode : string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^#([0-9a-fA-F]{3}){1,2}$/)
    TextColorDarkMode : string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^#([0-9a-fA-F]{3}){1,2}$/)
    BtnColorLightMode : string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^#([0-9a-fA-F]{3}){1,2}$/)
    BtnColorDarkMode : string;
}
