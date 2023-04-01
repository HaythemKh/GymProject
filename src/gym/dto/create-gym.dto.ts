
import { Exclude } from 'class-transformer';
import {IsNotEmpty,IsEmail,IsOptional,IsNumber,IsDate,IsString,ArrayMinSize,IsPhoneNumber} from 'class-validator'

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

    @IsNotEmpty()
    @IsString()
    Color : string;

    @IsOptional()
    @IsString()
    gymConfig : string;

}
