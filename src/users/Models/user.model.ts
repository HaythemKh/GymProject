import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { Role } from 'src/Schemas/users.models';
import { Gender } from 'src/Schemas/users.models';
import { Model } from 'mongoose';

export class User {
    
    private  _id : string;
    private  firstName : string;
    private  lastName : string;
    private  Email : string;
    private  Password : string;
    private  Gender : Gender;
    private  BirthDate : Date;
    private  Address : string;
    private  Phone : string;
    private  Height : number;
    private  Weight : number;
    private  Role : Role;
    private  Gym : string;


    constructor(userData : any)
    {
        this._id = userData._id;
        this.firstName = userData.firstName;
        this.lastName = userData.lastName;
        this.Email = userData.Email;
        this.Password = userData.Password;
        this.Gender = userData.Gender;
        this.BirthDate = userData.BirthDate;
        this.Address = userData.Address;
        this.Phone = userData.Phone;
        this.Role = userData.Role;
        this.Gym = userData.Gym;
        this.Height = userData.Height;
        this.Weight = userData.Weight;
    }

}
