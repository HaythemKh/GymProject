import { PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsBooleanString, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
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
    @IsNumber()
    Duration : number;

    @IsNotEmpty()
    @IsNumber()
    Price : number;
}
