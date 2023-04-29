 import { Exclude } from 'class-transformer';
import {IsNotEmpty,IsEmail,IsOptional,IsNumber,IsDate,IsString,ArrayMinSize,IsPhoneNumber, IsBoolean, IsBooleanString} from 'class-validator'

export class CreateEquipmentDto {

    @Exclude()
    _id : string;

    @IsNotEmpty()
    @IsString()
    Name : string;

    @IsNotEmpty()
    @IsString()
    Description : string;

    @IsNotEmpty()
    @IsBooleanString()
    Availability : boolean;

    @IsNotEmpty()
    @IsString()
    Image : string;

    @IsOptional()
    @IsString()
    Gym : string;

}
