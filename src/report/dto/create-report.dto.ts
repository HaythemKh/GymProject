import { Exclude } from "class-transformer";
import {  IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateReportDto {

    @Exclude()
    _id : string;

    @IsOptional()
    @IsString()
    UserID : string;

    @IsOptional()
    @IsDateString()
    DateTime : Date;

    @IsString()
    Description : string;
}
