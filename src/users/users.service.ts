import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(Person.name) private userModel : Model<UserDocument>, 
    @Inject(GymService) private  gymService : GymService 
    ){}
 
  
    
  async create(CurrentUser: CreateUserDto,req : any) : Promise<any> {

    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    let current : User = null;

    CurrentUser.Gym = req.user.gym;
    const hashedPassword = await bcrypt.hash(CurrentUser.Password,10);
    CurrentUser.Password = hashedPassword;
    if (CurrentUser.Role === Role.ADMIN)  current = new admin(CurrentUser);
    else if(CurrentUser.Role === Role.MEMBER) current = new member(CurrentUser);
    else if(CurrentUser.Role === Role.TRAINER)  current = new trainer(CurrentUser);


    const userEmail = await this.userModel.findOne({Email : CurrentUser.Email});
    const userPhone = await this.userModel.findOne({Phone : CurrentUser.Phone});
    this.verifValidId(req.user.gym);
    if (!isEmpty(userEmail)) throw new NotFoundException("Email Exist");
    else
    if (!isEmpty(userPhone)) throw new NotFoundException("phone number exist");
    else
    {
      const gymExist = await this.gymService.verifGymExist(req.user.gym);
      if(isEmpty(gymExist))throw new NotFoundException("this gym doesn't exist");
      else
      {
          const CreatedUser = await this.userModel.create(current);
          const IdUser = CreatedUser._id;
          if(CreatedUser)
          {
              await this.gymService.addUserToList(CreatedUser.Gym,IdUser);
              return {"message" : "user created successfully"};
          }              
      }      
      
    }
  }


  async findAllUsers(req : any) : Promise<User[]> {

    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    const AllUsers = await this.userModel.find({Gym : req.user.gym}).exec();
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

 async findAllAdmins(req : any) : Promise<admin[]> {
  if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");
   const AllAdmins = await this.userModel.find({ Role: Role.ADMIN,Gym :req.user.gym }).exec();
   let listAdmins : admin[] = [] ;
   AllAdmins.map(userJson => {
     listAdmins.push(new admin(userJson));
   });
    return listAdmins;
 }

 async findAllMembers(req : any) : Promise<member[]> {
  if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");
   const AllMembers = await this.userModel.find({ Role: Role.MEMBER,Gym :req.user.gym }).exec();
   let listMembers : member[] = [] ;
   AllMembers.map(userJson => {
     listMembers.push(new member(userJson));
   });
    return listMembers;
 }

 async findAllTrainers(req : any) : Promise<trainer[]> {
  if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");
   const AllTrainers = await this.userModel.find({ Role: Role.TRAINER,Gym :req.user.gym }).exec();
   let listTrainers : trainer[] = [] ;
   AllTrainers.map(userJson => {
     listTrainers.push(new trainer(userJson));
   });
    return listTrainers;
 }
 IsUserExist(id : string) : boolean {
  const currrentUser =  this.userModel.findOne({_id: id}).exec();
   return !isEmpty(currrentUser);
 }

 

 async findOne(id: string,req : any) : Promise<User> {

  if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

   this.verifValidId(id);
   const currrentUser = await this.userModel.findOne({_id: id, Gym : req.user.gym}).exec();
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
    throw new NotFoundException("invalid User ID");
 }

 async update(id: string, updateUserDto: UpdateUserDto, req : any) : Promise<any> {

  if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

   this.verifValidId(id);
   const foundDocument = await this.userModel.findOne({ _id: id,Gym : req.user.gym }).exec();
   if(isEmpty(foundDocument)) throw new NotFoundException("user doesn't exist");
   else
   {
    const hashedPassword = await bcrypt.hash(updateUserDto.Password,10);
    updateUserDto.Password = hashedPassword;
    let user : User = null;

    if (foundDocument.Role === Role.ADMIN)  user = new admin(updateUserDto);
    else if(foundDocument.Role === Role.MEMBER) user = new member(updateUserDto);
    else if(foundDocument.Role === Role.TRAINER)  user = new trainer(updateUserDto);

   const updatedUser = await this.userModel.findByIdAndUpdate(
     {_id : id},
     {$set: user},
     {new: true},
   )
   if(!isEmpty(updatedUser)) return {"message" : "user updated successfully"};
   else throw new NotFoundException("updating user denied");
  }
 }

 IsTrainerExist(id : string) : boolean{
  const currrentTrainer =  this.userModel.findOne({_id: id,Role : Role.TRAINER}).exec();
  return !isEmpty(currrentTrainer);
}

 async remove(id: string,req : any) : Promise<any> {
  if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

   this.verifValidId(id);
   const deletedUser = await this.userModel.findByIdAndDelete({_id : id,Gym : req.user.gym});
   if(deletedUser){  
     await this.gymService.RemoveUserFromList(deletedUser.Gym,deletedUser._id);
     return {"message" : "user deleted successfully"};
   } 
   else throw new NotFoundException("user doesn't exist");
 }

 async PersonalInformation (req : any) : Promise<any>{
  const currrentUser = await this.userModel.findOne({_id: req.user.sub, Gym : req.user.gym}).exec();
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


}
