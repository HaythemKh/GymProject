import { Exclude } from 'class-transformer';
import {IsNotEmpty,IsEmail,IsOptional,IsNumber,IsDate,IsString,ArrayMinSize,IsPhoneNumber, IsBoolean} from 'class-validator'

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
    Availability : boolean;

    @IsOptional()
    @IsString()
    Image : string;

}
