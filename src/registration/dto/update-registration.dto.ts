import { PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsBooleanString, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';
import { CreateRegistrationDto } from './create-registration.dto';

export class UpdateRegistrationDto{

    @Exclude()
    _id : string;

    @IsOptional()
    @IsString()
    Member : string;

    @IsOptional()
    @IsString()
    Course : string;

    @IsOptional()
    @IsBooleanString()
    IsActive : Boolean;

    @IsOptional()
    @IsNumberString()
    Duration : number;

    @IsNotEmpty()
    @IsNumberString()
    Price : number;
}
