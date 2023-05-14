import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Person, Role, UserDocument } from 'src/Schemas/users.models';
import { User } from 'src/users/Models/user.model';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Person.name) private userModel : Model<UserDocument>,
        private jwtService : JwtService
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
}
