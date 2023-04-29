import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseService } from 'src/course/course.service';
import { GymService } from 'src/gym/gym.service';
import { registration } from 'src/registration/Model/registration.model';
import { SubsMembership, SubsMembershipDocument } from 'src/Schemas/subsmembership.models';
import { Role } from 'src/Schemas/users.models';
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
    @Inject(UsersService) private  usersService : UsersService,
    @Inject(GymService) private  gymService : GymService
  ){}


  async create(createSubsMembershipDto: CreateSubsMembershipDto,req : any) : Promise<any> {

    if(req.user.role !== Role.MEMBER) throw new UnauthorizedException("Member only can get access to this !!");

    this.verifValidId(createSubsMembershipDto.Subscription);
    createSubsMembershipDto.Member = req.user.sub;

    const verif = await this.subsMembershipModel.findOne({Member : req.user.sub,Subscription :createSubsMembershipDto.Subscription });
    if(verif) throw new BadRequestException("You are already subscribed to this Subscription");
    const Register = new subsmembership(createSubsMembershipDto);
    const created = await this.subsMembershipModel.create(Register);
    if(!created) throw new BadRequestException("there is a problem in the creation of the subsMembership")
    return "subsMembership created successfully";
  }

  verifValidId(id: string){
    const isHexString = /^[0-9a-fA-F]+$/.test(id);
    if(!isHexString || id.length != 24)
     throw new NotFoundException("invalid subsMembership ID");
  }

  async findAll(req : any) : Promise<any> {

    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");
    
    const UserList = await this.gymService.getUserListByGym(req.user.gym);

    const AllMemberships = await this.subsMembershipModel.find({Member : {$in : UserList}}).exec();
    let listMemberships : subsmembership[] = [] ;
    AllMemberships.map(subsmembershipJson => {  
      listMemberships.push(new subsmembership(subsmembershipJson));
    });
    return  listMemberships;
  }

  async findOne(id: string) : Promise<any> {
    return `This action returns a #${id} subsMembership`;
  }

  async update(id: string, updateSubsMembershipDto: UpdateSubsMembershipDto) : Promise<any> {
    return `This action updates a #${id} subsMembership`;
  }

  async remove(id: string) : Promise<any> {
    return `This action removes a #${id} subsMembership`;
  }
}
