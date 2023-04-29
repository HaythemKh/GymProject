import { PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsBooleanString, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateSubsMembershipDto } from './create-subs-membership.dto';

export class UpdateSubsMembershipDto{
    @Exclude()
    _id : string;

    @IsOptional()
    @IsString()
    Member : string;

    @IsOptional()
    @IsString()
    Subscription : string;

    @IsOptional()
    @IsBooleanString()
    IsActive : Boolean;

    @IsOptional()
    @IsNumber()
    Price : number;

    @IsOptional()
    @IsNumber()
    Duration : number;
}
