
import { Exclude, Type } from 'class-transformer';
import {IsNotEmpty,IsEmail,IsOptional,IsNumber,IsDate,IsString,ArrayMinSize,IsPhoneNumber, ValidateNested, Matches} from 'class-validator'

export class CreateGymDto {

    @Exclude()
    _id : string;

    @IsNotEmpty()
    @IsString()
    fullName : string;

    @IsNotEmpty()
    @IsString()
    address : string;

    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber('TN')
    phone : string;

    @IsNotEmpty()
    @IsEmail()
    Email : string;

    @IsString({ each: true })
    @ArrayMinSize(0)
    users : string[];

    @IsString({ each: true })
    @ArrayMinSize(0)
    subscriptions : string[];

    @IsString({ each: true })
    @ArrayMinSize(0)
    equipments : string[];

    @IsString({ each: true })
    @ArrayMinSize(0)
    courses : string[];

    @IsNotEmpty()
    @IsString()
    OpeningTime : Date;

    @IsNotEmpty()
    @IsString()
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

    @IsString()
    @IsNotEmpty()
    @Matches(/^#([0-9a-fA-F]{3}){1,2}$/)
    SidebarLightMode : string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^#([0-9a-fA-F]{3}){1,2}$/)
    SidebarDarkMode : string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^#([0-9a-fA-F]{3}){1,2}$/)
    NavbarLightMode : string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^#([0-9a-fA-F]{3}){1,2}$/)
    NavbarDarkMode : string;

    @IsOptional()
    @IsString()
    gymConfig : string;

}
