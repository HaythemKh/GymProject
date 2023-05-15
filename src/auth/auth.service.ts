import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Person, Role, UserDocument } from 'src/Schemas/users.models';
import { User } from 'src/users/Models/user.model';
import { UsersService } from 'src/users/users.service';
import { AuthDto, SendEmailDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { SendEmailService } from 'src/send-email/send-email.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Person.name) private userModel : Model<UserDocument>,
        private jwtService : JwtService,
        @Inject(SendEmailService) private readonly sendMailService: SendEmailService
        ){}

    async signInLocal(login : AuthDto) : Promise<any>{
        // retrieve user

        const user = await this.userModel.findOne({Email : login.Email});
        if (!user || user.Role !== Role.ADMIN)  throw new UnauthorizedException("Credentials incorrect");
        const passwordMatch = await bcrypt.compare(login.Password,user.Password);
        if (!passwordMatch) throw new UnauthorizedException("Invalid username or password");

        return this.SignUser(user._id,user.Email,user.Role,user.Gym);
    }

    async signInUser(login : AuthDto) : Promise<any>{
        const user = await this.userModel.findOne({Email : login.Email});
        if(!user || (user.Role === Role.ADMIN))
            throw new UnauthorizedException("Credentials incorrect");
        const passwordMatch = await bcrypt.compare(login.Password,user.Password);
        if(!passwordMatch) throw new UnauthorizedException("Invalid username or password");

        return this.SignUser(user._id,user.Email,user.Role,user.Gym);
    }

    SignUser(userId : string, email : string, role : Role, gym : string){
        return this.jwtService.sign({
            sub : userId,
            email : email,
            role : role,
            gym : gym,
        })
    }


    async forgotPassword(forgotPasswordDto : SendEmailDto) : Promise<any>{
        const email = forgotPasswordDto.email;
        

        const user = await this.userModel.findOne({Email : email});
        if(!user) throw new NotFoundException("User not found");

        const resetToken = Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15);
        await this.userModel.updateOne(
            {Email : email,},
            {
            $set : {
                resetPasswordToken : resetToken,
                resetPasswordExpires : Date.now() + 3600000, // 1 Hour 
                }
            }
        );
        console.log(resetToken);
        const resetCode = `https://example.com/reset-password/${resetToken}`;
        const subject = 'Reset your password by verification code';
        const message = `
            
        <b>Use this code to verify your email address on GymApp</b>
        Hello ${user.firstName},

      You are receiving this email because you requested a password reset for your account.

      This code can only be used once Please ignore this email if you did not request a code.
      Never share this code with anyone else.

      <b>confirmation code</b>

      <b>${resetCode}</>

      Thanks,
      The Gym Owner Team
    `;

    await this.sendMailService.sendMail(email, subject, message);


    }
}
