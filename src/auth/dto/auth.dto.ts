import { Exclude } from 'class-transformer';
import {IsNotEmpty,IsEmail,IsOptional,IsNumber,IsDate,IsString,ArrayMinSize,IsPhoneNumber, isEmail} from 'class-validator'

export class AuthDto {

    @IsEmail()
    Email : string;

    @IsString()
    Password : string;

    @IsOptional()
    @IsString()
    deviceToken : string;
}

    export class SendEmailDto {
    @IsEmail()
    email: string;
    }
  
  export class ResetPasswordDto {

    @IsString()
    resetCode : string;
    @IsString()
    newPassword: string;
  }

  export class verifCodeDto{
    @IsString()
    resetCode : string;
  }