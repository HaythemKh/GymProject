 import { Exclude } from 'class-transformer';
import {IsNotEmpty,IsEmail,IsOptional,IsNumber,IsDate,IsString,ArrayMinSize,IsPhoneNumber, IsBoolean} from 'class-validator'

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
    @IsBoolean()
    Availability : boolean;

    @IsNotEmpty()
    @IsString()
    Image : string;

    @IsNotEmpty()
    @IsString()
    Gym : string;

}
