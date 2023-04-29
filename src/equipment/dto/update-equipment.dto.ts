import { Exclude } from 'class-transformer';
import {IsNotEmpty,IsEmail,IsOptional,IsNumber,IsDate,IsString,ArrayMinSize,IsPhoneNumber, IsBooleanString} from 'class-validator'

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
    @IsBooleanString()
    Availability : boolean;

    @IsOptional()
    @IsString()
    Image : string;

}
