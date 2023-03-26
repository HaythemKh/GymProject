import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'class-validator';
import { Model } from 'mongoose';
import { GymService } from 'src/gym/gym.service';
import { Person, Role, UserDocument } from 'src/Schemas/users.models';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { admin } from './Models/admin.model';
import { member } from './Models/member.model';
import { trainer } from './Models/trainer.model';
import { User } from './Models/user.model';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(Person.name) private userModel : Model<UserDocument>, 
    @Inject(GymService) private  gymService : GymService 
    ){}
 

  async create(CurrentUser: CreateUserDto) : Promise<any> {
    let current : User = null;

    if (CurrentUser.Role === Role.ADMIN)  current = new admin(CurrentUser);
    else if(CurrentUser.Role === Role.MEMBER) current = new member(CurrentUser);
    else if(CurrentUser.Role === Role.TRAINER)  current = new trainer(CurrentUser);

    const userEmail = await this.userModel.findOne({Email : CurrentUser.Email});
    const userPhone = await this.userModel.findOne({Phone : CurrentUser.Phone});
    this.verifValidId(CurrentUser.Gym);
    if (!isEmpty(userEmail)) throw new NotFoundException("Email Exist");
    else
    if (!isEmpty(userPhone)) throw new NotFoundException("phone number exist");
    else
    {
      const gymExist = await this.gymService.verifGymExist(CurrentUser.Gym);
      if(isEmpty(gymExist))throw new NotFoundException("this gym doesn't exist");
      else
      {
          const CreatedUser = await this.userModel.create(CurrentUser);
          const IdUser = CreatedUser._id;
          if(CreatedUser)
          {
              await this.gymService.addUserToList(CreatedUser.Gym,IdUser);
              return {"message" : "user created successfully"};
          }              
      }      
      
    }
  }

  async findAllUsers() : Promise<User[]> {
    const AllUsers = await this.userModel.find().exec();
    let listUsers : User[] = [] ;
    let user : User;
    AllUsers.map(userJson => {
     if (userJson.Role == Role.ADMIN) user = new User(userJson);else
     if(userJson.Role == Role.TRAINER) user = new trainer(userJson);else
     if(userJson.Role == Role.MEMBER) user = new member(userJson);
     listUsers.push(user)
    });
     return listUsers;
 }

 async findAllAdmins() : Promise<admin[]> {
   const AllAdmins = await this.userModel.find({ Role: Role.ADMIN }).exec();
   let listAdmins : admin[] = [] ;
   AllAdmins.map(userJson => {
     listAdmins.push(new admin(userJson));
   });
    return listAdmins;
 }

 async findAllMembers() : Promise<member[]> {
   const AllMembers = await this.userModel.find({ Role: Role.MEMBER }).exec();
   let listMembers : member[] = [] ;
   AllMembers.map(userJson => {
     listMembers.push(new member(userJson));
   });
    return listMembers;
 }

 async findAllTrainers() : Promise<trainer[]> {
   const AllTrainers = await this.userModel.find({ Role: Role.TRAINER }).exec();
   let listTrainers : trainer[] = [] ;
   AllTrainers.map(userJson => {
     listTrainers.push(new trainer(userJson));
   });
    return listTrainers;
 }

 

 async findOne(id: string) : Promise<User> {

   this.verifValidId(id);

   const currrentUser = await this.userModel.findOne({_id: id}).exec();
   if(isEmpty(currrentUser)) throw new NotFoundException("user doesn't exist");
   else
   {
     let user : User;

     if(currrentUser["Role"] == "trainer") user = new trainer(currrentUser);
     if(currrentUser["Role"] == "member") user = new member(currrentUser);
     if(currrentUser["Role"] == "admin") user = new admin(currrentUser);

     return user;
   }
 }
 
  verifValidId(id: string){
   const isHexString = /^[0-9a-fA-F]+$/.test(id);
   if(!isHexString || id.length != 24)
    throw new NotFoundException("invalid ID");
 }

 async update(id: string, updateUserDto: UpdateUserDto) : Promise<any> {

   let currrentUser : User = null;
   this.verifValidId(id);
   const foundDocument = await this.userModel.findOne({ _id: id }).exec();
   if(isEmpty(foundDocument)) throw new NotFoundException("user doesn't exist");
   else
   {
   const myRole = foundDocument["Role"];

   (foundDocument["Role"] === "admin")   ?  currrentUser = new admin(updateUserDto):
   (foundDocument["Role"] === "member")  ?  currrentUser = new member(updateUserDto):
   (foundDocument["Role"] === "trainer") ?  currrentUser = new trainer(updateUserDto):null;
   
   currrentUser.Role = myRole;
   const updatedUser = await this.userModel.findByIdAndUpdate(
     {_id : id},
     {$set: currrentUser},
     {new: true},
   )
   let updated : User;
   if(currrentUser.Role == Role.ADMIN) updated = new admin(updatedUser);else
   if(currrentUser.Role == Role.TRAINER) updated = new trainer(updatedUser);else
   if(currrentUser.Role == Role.MEMBER) updated = new member(updatedUser);

   if(!isEmpty(updatedUser)) return {"message" : "user updated successfully"};
   else throw new NotFoundException("updating user denied");
 }
 }

 async remove(id: string) : Promise<any> {
   this.verifValidId(id);
   const deletedUser = await this.userModel.findByIdAndDelete({_id : id});
   if(deletedUser){  
     await this.gymService.RemoveUserFromList(deletedUser.Gym,deletedUser._id);
     return {"message" : "user deleted successfully"};
   } 
   else throw new NotFoundException("user doesn't exist");
 }
}
