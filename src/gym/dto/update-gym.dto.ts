import { CreateGymDto } from './create-gym.dto';
import {IsNotEmpty,IsEmail,IsOptional,IsNumber,IsDate,IsString,ArrayMinSize,IsPhoneNumber} from 'class-validator'
import { Exclude } from 'class-transformer';

export class UpdateGymDto{

    @Exclude()
    _id : string;

    @IsOptional()
    @IsString()
    fullName : string;

    @IsOptional()
    @IsString()
    address : string;

    @IsOptional()
    @IsEmail()
    Email : string;

    @IsOptional()
    @IsString()
    @IsPhoneNumber('TN')
    phone : string;

    @IsOptional()
    @IsString({ each: true })
    @ArrayMinSize(0)
    users : string[];

    @IsOptional()
    @IsString({ each: true })
    @ArrayMinSize(0)
    subscriptions : string[];

    @IsOptional()
    @IsString({ each: true })
    @ArrayMinSize(0)
    equipments : string[];

    @IsOptional()
    @IsString({ each: true })
    @ArrayMinSize(0)
    courses : string[];
}
