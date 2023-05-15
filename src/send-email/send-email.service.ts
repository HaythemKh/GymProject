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

    async sendMail(to: string, subject: string, message: string) {
        const options = {
          from: 'GymApp2023@gmail.com',
          to: to,
          subject: subject,
          html: message,
        };
        const result = await this.transporter.sendMail(options);
        return "Email sent"
            
        }catch (error){
            throw new BadRequestException(`Email does not sent : ${error}`);
      }
}
