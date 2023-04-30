import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { Role } from 'src/Schemas/users.models';
import { Gender } from 'src/Schemas/users.models';
import { Model } from 'mongoose';

export class User {
    
    public readonly  _id : string;
    public readonly  firstName : string;
    public readonly  lastName : string;
    public readonly  Email : string;
    public readonly  Password : string;
    public readonly  Gender : Gender;
    public readonly  BirthDate : Date;
    public readonly  Address : string;
    public readonly  Phone : string;
    public readonly  Height : number;
    public readonly  Weight : number;
    public readonly  Role : Role;
    public readonly  Gym : string;


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
