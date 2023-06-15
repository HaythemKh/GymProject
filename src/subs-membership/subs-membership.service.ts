import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'class-validator';
import { addDays } from 'date-fns';
import { Model } from 'mongoose';
import { CourseService } from 'src/course/course.service';
import { GymService } from 'src/gym/gym.service';
import { notification } from 'src/notification/notification.model';
import { NotificationService } from 'src/notification/notification.service';
import { registration } from 'src/registration/Model/registration.model';
import { Subscription, SubscriptionDocument } from 'src/Schemas/subscription.models';
import { SubsMembership, SubsMembershipDocument } from 'src/Schemas/subsmembership.models';
import { Person, Role, UserDocument } from 'src/Schemas/users.models';
import { subscription } from 'src/subscription/Model/subscription.model';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { UsersService } from 'src/users/users.service';
import { CreateSubsMembershipDto } from './dto/create-subs-membership.dto';
import { UpdateSubsMembershipDto } from './dto/update-subs-membership.dto';
import { subsmembership } from './Model/subsmembership.model';

@Injectable()
export class SubsMembershipService {

  constructor(
    @InjectModel(SubsMembership.name) private subsMembershipModel : Model<SubsMembershipDocument>,
    @Inject(SubscriptionService) private  subscriptionService : SubscriptionService,
    @InjectModel(Person.name) private userModel : Model<UserDocument>,
    @InjectModel(Subscription.name) private subscriptionModel : Model<SubscriptionDocument>,
    @Inject(UsersService) private  usersService : UsersService,
    @Inject(GymService) private  gymService : GymService,
    @Inject(NotificationService) private  notificationService : NotificationService,
  ){}


  async createMembership(createSubsMembershipDto: CreateSubsMembershipDto,req : any) : Promise<any> {

    if(req.user.role !== Role.MEMBER) throw new UnauthorizedException("Member only can get access to this !!");

    this.verifValidId(createSubsMembershipDto.Subscription);
    createSubsMembershipDto.Member = req.user.sub;

    const SubsList = await this.gymService.getSubscriptionsListByGym(req.user.gym);

    const latestSub = await this.subsMembershipModel.findOne({ Member: req.user.sub, IsActive: true }).sort({ createdAt: -1 });
    let creationTime: Date;
    if (latestSub) {
      const endTime = latestSub.createdAt.getTime() + (latestSub.Duration * 24 * 60 * 60 * 1000);
      const now = new Date(endTime);
      creationTime = now;
     } else
       creationTime = new Date(Date.now() + (createSubsMembershipDto.Duration * 24 * 60 * 60 * 1000));

       //console.log(creationTime);

        createSubsMembershipDto.createdAt = creationTime;
         const Register = new subsmembership(createSubsMembershipDto);
    //   // const Member = await this.subsMembershipModel.countDocuments({Member : req.user.sub,Subscription : {$in : SubsList},IsActive : true});
    //   // if(Member !== 0) throw new BadRequestException("You already subscribed to another subscription");
      const created = await this.subsMembershipModel.create(Register);
      if(!created) throw new BadRequestException("there is a problem in the creation of the subsMembership")

      const AdminData = {
        "Gym" : req.user.gym,
        "Title" : "Members subscriptions",
        "Message" : `new member purchase subscription`
      }
      const notifAdmins = new notification(AdminData);
      await this.notificationService.createNotification(notifAdmins);

      return "subsMembership created successfully";

  }

  async isSubscribed(id : string) : Promise<boolean>{
    const result = await this.subsMembershipModel.findOne({Member: id,IsActive : true}).exec();
    return !!result;
  }

  verifValidId(id: string){
    const isHexString = /^[0-9a-fA-F]+$/.test(id);
    if(!isHexString || id.length != 24)
     throw new NotFoundException("invalid subsMembership ID");
  }

  async findAllMembership(req : any) : Promise<any> {

    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");
    
    const UserList = await this.gymService.getUserListByGym(req.user.gym);

    const AllMemberships = await this.subsMembershipModel.find({Member : {$in : UserList}}).exec();
    const results = [];

    for (const subsUsers of AllMemberships)
    {
      const user = await this.userModel.findById(subsUsers.Member);
      const subscription = await this.subscriptionModel.findById(subsUsers.Subscription);
      const expirationDate = this.getExpirationDate(subsUsers.createdAt,subsUsers.Duration);

      if (user && subscription) {
        const combinedData = {
          ...subsUsers.toObject(),
          MemberName: user.firstName,
          MemberLastName: user.lastName,
          SubscriptionName : subscription.Name,
          ExpireDate : expirationDate
        };
        results.push(combinedData);
      }
    }
    return  results;
  }

  async findOne(id: string,req : any) : Promise<subsmembership> {
    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    this.verifValidId(id);
    const SubsMembershipModel = await this.subsMembershipModel.findOne({_id : id}).exec();
    if(isEmpty(SubsMembershipModel)) throw new NotFoundException("SubsMembership doesn't exist");
    const Subsmembership : subsmembership = new subsmembership(SubsMembershipModel);
    return  Subsmembership;
  }

  async update(id: string, updateSubsMembershipDto: UpdateSubsMembershipDto,req : any) : Promise<any> {
    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    this.verifValidId(id);
    const foundDocument = await this.subsMembershipModel.findOne({ _id: id}).exec();

    if(isEmpty(foundDocument)) throw new NotFoundException("subsMembership doesn't exist");
    const subsMembership = new subsmembership(updateSubsMembershipDto);
    const updatedSubsMembership = await this.subsMembershipModel.findByIdAndUpdate(
      {_id : foundDocument._id},
      {$set: subsMembership},
      {new: true},
    )

    if(!isEmpty(updatedSubsMembership)) return {"message" : "subsMembership updated successfully"};
    else throw new NotFoundException("updating subsMembership denied");
  }

  async remove(id: string,req : any) : Promise<any> {
    // if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    this.verifValidId(id);
    const deletedsubsMembership = await this.subsMembershipModel.findByIdAndDelete({_id : id});
    if(deletedsubsMembership)
    {
      return {"message" : "subsMembership deleted successfully"};
    } 
    else throw new NotFoundException("subsMembership doesn't exist");
  }

  getExpirationDate(createdDate : Date, Duration : number): Date {
    const expirationDate = addDays(createdDate, Duration);
    return expirationDate;
  }

  async PreviousSubscriptions(req : any) : Promise<subsmembership[]>{
    if(req.user.role !== Role.MEMBER) throw new UnauthorizedException("Only Members can get Access to This !!");
    
    const SubscriptionsList = await this.gymService.getSubscriptionsListByGym(req.user.gym);

    const AllMemberships = await this.subsMembershipModel.find({Member : req.user.sub,Subscription : {$in : SubscriptionsList}}).sort({ _id: -1 });
    const results = [];

    for (const subsUsers of AllMemberships)
    {
      const user = await this.userModel.findById(subsUsers.Member);
      const subscription = await this.subscriptionModel.findById(subsUsers.Subscription);
      const expirationDate = this.getExpirationDate(subsUsers.createdAt,subsUsers.Duration);

      if (user && subscription) {
        const combinedData = {
          ...subsUsers.toObject(),
          MemberName: user.firstName,
          MemberLastName: user.lastName,
          SubscriptionName : subscription.Name,
          ExpireDate : expirationDate
        };
        results.push(combinedData);
      }
    }
    return  results;

  }

  async LastOne(req : any) : Promise<subsmembership> {
    const SubsMembershipModel = await this.subsMembershipModel.findOne({Member : req.user.sub,IsActive : true}).sort({createdAt : -1});
    if(isEmpty(SubsMembershipModel)) throw new NotFoundException("SubsMembership doesn't exist");
    const Subsmembership : subsmembership = new subsmembership(SubsMembershipModel);
    return  SubsMembershipModel;
  }
}
