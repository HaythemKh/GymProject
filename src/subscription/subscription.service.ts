import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'class-validator';
import { Model } from 'mongoose';
import { course } from 'src/course/Model/course.model';
import { GymService } from 'src/gym/gym.service';
import { Subscription, SubscriptionDocument } from 'src/Schemas/subscription.models';
import { SubsMembership, SubsMembershipDocument } from 'src/Schemas/subsmembership.models';
import { Role } from 'src/Schemas/users.models';
import { trainer } from 'src/users/Models/trainer.model';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { subscription } from './Model/subscription.model';

@Injectable()
export class SubscriptionService {

  constructor(
    @InjectModel(Subscription.name) private subscriptionModel : Model<SubscriptionDocument>,
    @Inject(GymService) private  gymService : GymService,
    @InjectModel(SubsMembership.name) private subsMembershipModel : Model<SubsMembershipDocument>,
  ){}

  async create(createSubscriptionDto: CreateSubscriptionDto,req :any) : Promise<any> {
    
    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");
    createSubscriptionDto.Gym = req.user.gym;
    const findSubscription = await this.subscriptionModel.findOne({Name : createSubscriptionDto.Name,Gym :createSubscriptionDto.Gym }).exec();
    if(findSubscription) throw new NotFoundException("This name of subscription  exist in this gym");

     if(!(await this.gymService.verifGymExistID(createSubscriptionDto.Gym))) throw new NotFoundException("This gym doesn't exist ");

    const created = await this.subscriptionModel.create(createSubscriptionDto);
    if(!created) throw new NotFoundException("problem with subscription creation ");
    await this.gymService.addSubscriptionToList(createSubscriptionDto.Gym,created._id);
    
     return {"message" : "susbscription added successfully"};
  }

  async findAllSubscriptions(req : any) : Promise<subscription[]> {

    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    const AllSubscription = await this.subscriptionModel.find({Gym : req.user.gym}).exec();
    let listSubscriptions : subscription[] = [] ;
    AllSubscription.map(subscriptionJson => {
      listSubscriptions.push(new subscription(subscriptionJson));
    });

    return  listSubscriptions;
  }

  verifValidId(id: string){
    const isHexString = /^[0-9a-fA-F]+$/.test(id);
    if(!isHexString || id.length != 24)
     throw new NotFoundException("invalid ID");
  }

  async findOne(id: string,req : any) : Promise<any> {

    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    this.verifValidId(id);
    const currrentSubs = await this.subscriptionModel.findOne({_id: id}).exec();
    if(isEmpty(currrentSubs)) throw new NotFoundException("subscription doesn't exist");

    const Subscription : subscription = new subscription(currrentSubs);
    return Subscription;
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto,req : any) : Promise<any> {
    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    this.verifValidId(id);
    const foundDocument = await this.subscriptionModel.findOne({ _id: id,Gym : req.user.gym }).exec();

    if(isEmpty(foundDocument)) throw new NotFoundException("subscription doesn't exist");

    const Subscription : subscription = new subscription(updateSubscriptionDto);
    const updatedSubs = await this.subscriptionModel.findByIdAndUpdate(
      {_id : foundDocument._id},
      {$set: Subscription},
      {new: true},
    )

    if(!isEmpty(updatedSubs)) return {"message" : "subscription updated successfully"};
    else throw new NotFoundException("updating subscription denied");
  }

  async remove(id: string,req) : Promise<any> {
    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    this.verifValidId(id);
    const deletedSubs = await this.subscriptionModel.findByIdAndDelete({_id : id});
    if(deletedSubs){ 
      await this.gymService.RemoveSubscriptionFromList(deletedSubs.Gym,deletedSubs._id);
      return true;
    } 
    else throw new NotFoundException("subscription doesn't exist");
  }

  async AvailableSubscriptions(req : any) : Promise<subscription[]>{

    if(req.user.role !== Role.MEMBER) throw new UnauthorizedException("Only Members can get Access to This !!");

    const AllSubscriptions = await this.subscriptionModel.find({Gym : req.user.gym});
    const results = [];

      for (const subscription of AllSubscriptions) {
      // const VerifyMembershipSubscription = await this.subsMembershipModel.findOne({Member : req.user.sub, Subscription : subscription._id,IsActive : true});
      // if(!VerifyMembershipSubscription)
      results.push(subscription);
      }
      return  results;
  }
    
}
  

