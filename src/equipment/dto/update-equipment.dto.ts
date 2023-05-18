import { Exclude } from 'class-transformer';
import {IsNotEmpty,IsEmail,IsOptional,IsNumber,IsDate,IsString,ArrayMinSize,IsPhoneNumber, IsBooleanString, IsBoolean} from 'class-validator'

export class UpdateEquipmentDto {

    @Exclude()
    _id : string;

    @Exclude()
    Gym : string;

    @IsOptional()
    @IsString()
    Name : string;

    @IsOptional()
    @IsString()
    Description : string;

    @IsOptional()
    @IsBoolean()
    Availability : Boolean;

    @IsOptional()
    @IsString()
    Image : string;

}
