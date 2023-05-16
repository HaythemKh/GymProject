import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Person, Role, UserDocument } from 'src/Schemas/users.models';
import { User } from 'src/users/Models/user.model';
import { UsersService } from 'src/users/users.service';
import { AuthDto, ResetPasswordDto, SendEmailDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { SendEmailService } from 'src/send-email/send-email.service';
import * as moment from 'moment';


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

        const codeLength = 6; 
        let verificationCode = '';
        let codeCharacters : string = '0123456789'; 
        let usedCodes : Set<string> = new Set(); 

        do {
        verificationCode = this.generateRandomCode(codeLength,codeCharacters);
        } while (usedCodes.has(verificationCode));

        usedCodes.add(verificationCode);

        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 2);

        console.log(expirationDate)
  
        await this.userModel.updateOne(
            {Email : email,},
            {
            $set : {
                resetPasswordCode : verificationCode,
                resetPasswordExpiresCode : expirationDate,
                }
            }
        );
        console.log(verificationCode);
        const subject = 'Reset your password by verification code';
        const message = `
        <br><div style="font-size: 18px;background-color: #f5f5f5;border: 1px solid #e0e0e0; padding: 15px; border-radius: 4px;">
        <p><b>Verification Code of your account in gymp</b></p>
        <p>Hello ${user.firstName},<p>

        <p>You are receiving this email because you requested a password reset for your account.</p>

        <p>This code can only be used once Please ignore this email if you did not request a code.
        Never share this code with anyone else.</p>

        <p><b>confirmation code</b></p>

        <div style="background: linear-gradient(to bottom, #f2f2f2, #e6e6e6); border: 1px solid #ccc; padding: 15px; border-radius: 4px;">
        <p style="font-size: 24px; font-weight: bold; margin: 0; text-align: center;">${verificationCode}</p>
        </div>
        <p>Thanks,</p>
        <p>The Gym Support Team</p>
        </div>
    `;

    if(await this.sendMailService.sendMail(email, subject, message))
        return {"Message" :'Email sent successfully'};
        else
        return {"Message" :'Email sending error'};


    }
    generateRandomCode(codeLength : number,codeCharacters : string): string {
        let code = '';
        for (let i = 0; i < codeLength; i++) {
          const randomIndex = Math.floor(Math.random() * codeCharacters.length);
          code += codeCharacters[randomIndex];
        }
        return code;    
    }

    async resetPassword(resetPasswordDto : ResetPasswordDto) : Promise<any>{

        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1);

        const filter = {
            resetPasswordCode: resetPasswordDto.resetCode,
            resetPasswordExpiresCode: { $gt: expirationDate },
          };

          const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword,10);
      
          const update = {
            $set: {
              Password: hashedPassword,
              resetPasswordCode: '',
              resetPasswordExpiresCode: '',
            },
            
          };
          const updatedUser = await this.userModel.findOneAndUpdate(
            filter,
            update,
            { new: true }
          );

          if (!updatedUser) {
            throw new BadRequestException('Invalid or expired verification code');
          }
          return {"Message" : "Password changed Successfully"};
    }
 
}
