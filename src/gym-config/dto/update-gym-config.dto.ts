import { Exclude } from "class-transformer";
import { IsDecimal, IsNotEmpty, IsNumber, IsNumberString, IsString, MaxLength, MinLength, Validator,IsOptional, Matches } from "class-validator";


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
    @Matches(/^#([0-9a-fA-F]{3}){1,2}$/)
    BackgroundLightMode : string;

    @IsOptional()
    @IsString()
    @Matches(/^#([0-9a-fA-F]{3}){1,2}$/)
    BackgroundDarkMode : string;

    @IsOptional()
    @IsString()
    @Matches(/^#([0-9a-fA-F]{3}){1,2}$/)
    TextColorLightMode : string;

    @IsOptional()
    @IsString()
    @Matches(/^#([0-9a-fA-F]{3}){1,2}$/)
    TextColorDarkMode : string;

    @IsOptional()
    @IsString()
    @Matches(/^#([0-9a-fA-F]{3}){1,2}$/)
    BtnColorLightMode : string;

    @IsOptional()
    @IsString()
    @Matches(/^#([0-9a-fA-F]{3}){1,2}$/)
    BtnColorDarkMode : string;
}
