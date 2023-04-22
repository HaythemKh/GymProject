import { Exclude } from 'class-transformer';
import {IsNotEmpty,IsEmail,IsOptional,IsNumber,IsDate,IsString,ArrayMinSize,IsPhoneNumber, isEmail} from 'class-validator'

export class AuthDto {

    @IsEmail()
    Email : string;

    @IsString()
    Password : string;

}