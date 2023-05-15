import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class SendEmailService {
    private transporter : nodemailer.Transporter;

    constructor(){
        this.transporter = nodemailer.createTransport({
            service : "gmail",
            auth : {
                user : process.env.EMAIL_USER,
                pass : process.env.EMAIL_PASS
            },
        });
    }

    async sendMail(to: string, subject: string, message: string) : Promise<Boolean> {
        try{
        const options = {
          from: process.env.EMAIL_USER,
          to: to,
          subject: subject,
          html: message,
        };
        await this.transporter.sendMail(options);
        return true;
        }catch (error){
            return false;
      }
    }
}
