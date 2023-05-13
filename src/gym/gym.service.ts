import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'class-validator';
import { Model } from 'mongoose';
import { CreateGymConfigDto } from 'src/gym-config/dto/create-gym-config.dto';
import { GymConfigService } from 'src/gym-config/gym-config.service';
import { Course, CourseDocument } from 'src/Schemas/course.models';
import { Equipment, EquipmentDocument } from 'src/Schemas/equipment.models';
import { Gym, GymDocument } from 'src/Schemas/gym.models';
import { Registration, RegistrationDocument } from 'src/Schemas/Registration.models';
import { Subscription, SubscriptionDocument } from 'src/Schemas/subscription.models';
import { SubsMembership, SubsMembershipDocument } from 'src/Schemas/subsmembership.models';
import { Person, Role, UserDocument } from 'src/Schemas/users.models';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { gym } from './Model/gym.model';

@Injectable()
export class GymService {

  constructor(
    @InjectModel(Gym.name) private gymModel : Model<GymDocument>,
    @InjectModel(Person.name) private userModel : Model<UserDocument>,
    @InjectModel(Subscription.name) private subscriptionModel : Model<SubscriptionDocument>,
    @InjectModel(Equipment.name) private equipmentModel : Model<EquipmentDocument>,
    @Inject(GymConfigService) private  gymConfigService : GymConfigService,
    @InjectModel(Course.name) private courseModel : Model<CourseDocument>,
    @InjectModel(SubsMembership.name) private subsMembershipModel : Model<SubsMembershipDocument>,
    @InjectModel(Registration.name) private registrationModel : Model<RegistrationDocument>,
  ){}
  
  async create(createGymDto: CreateGymDto, req :any) : Promise<any> {
    
    let {OpeningTime,ClosingTime,Logo,BackgroundLightMode,BackgroundDarkMode,TextColorLightMode,TextColorDarkMode,BtnColorLightMode,BtnColorDarkMode,SidebarLightMode,
      SidebarDarkMode,
      NavbarLightMode,
      NavbarDarkMode} = createGymDto;
      
    let myOpeneningtime = OpeningTime;OpeningTime = new Date(Date.parse(`01/01/2000 ${myOpeneningtime}`));
    let myClosingtime = ClosingTime;ClosingTime = new Date(Date.parse(`01/01/2000 ${myClosingtime}`));

    const createConfig : CreateGymConfigDto = {
      OpeningTime, ClosingTime, Logo, BackgroundLightMode, BackgroundDarkMode, TextColorLightMode, TextColorDarkMode, BtnColorLightMode, BtnColorDarkMode,
      SidebarLightMode,
      SidebarDarkMode,
      NavbarLightMode,
      NavbarDarkMode
    };
    const verifEmail = await this.gymModel.findOne({Email : createGymDto.Email});

    if (!isEmpty(verifEmail))
    throw new NotFoundException("Email already reserved to another gym ");
    
    const ConfigId = await this.gymConfigService.create(createConfig);
    createGymDto.gymConfig = ConfigId;
    const newGym = new gym(createGymDto);

    const createdGym = await this.gymModel.create(newGym);
    if(createdGym)
    return {"message" : "gym created successfully"};
  }


  async verifGymExist(id : string) : Promise<gym>
  {
    const verifGym = await this.gymModel.findOne({_id : id});
    const Gym = new gym(verifGym);
    return Gym;
  }
  async verifGymExistID(gymId : string) : Promise<Boolean>
  {
    this.verifValidId(gymId);
    const verifGym = await this.gymModel.findOne({_id : gymId});
    if(!verifGym) return  false;
    return true;
  }



  async userExistsInList(userId: string, gymId: string): Promise<boolean> {
    const list = await this.gymModel.findOne({ _id: gymId, users: { $in: [userId] } });
    return !!list;
  }
  
  async addUserToList(gymId: string, userId: string): Promise<void> {
    await this.gymModel.updateOne({ _id: gymId }, { $push: { users: userId } });
  }

  async addSubscriptionToList(gymId: string, subId: string): Promise<void> {
    await this.gymModel.updateOne({ _id: gymId }, { $push: { subscriptions: subId } });
  }

  async addEquipmentToList(gymId : string, EquipId : string) :Promise<void>{
    await this.gymModel.updateOne({ _id: gymId }, { $push: { equipments: EquipId } });
  }

  async addCourseToList(gymId : string, CourseId : string) :Promise<void>{
    await this.gymModel.updateOne({ _id: gymId }, { $push: { courses: CourseId } });
  }

  async RemoveCourseFromList(gymId : string, CourseId : string) :Promise<void>{
    await this.gymModel.updateOne({ _id: gymId }, { $pull: { courses: CourseId } });
  }

  async RemoveSubscriptionFromList(gymId: string, subId: string): Promise<void> {
    await this.gymModel.updateOne({ _id: gymId }, { $pull: { subscriptions: subId } });
  }

  async RemoveUserFromList(gymId: string, userId: string): Promise<void> {
    await this.gymModel.updateOne({ _id: gymId }, { $pull: { users: userId } });
  }

  async RemoveEquipmentFromList(gymId: string, EquipId: string): Promise<void> {
    await this.gymModel.updateOne({ _id: gymId }, { $pull: { equipments: EquipId } });
  }
  

  verifValidId(id: string){
    const isHexString = /^[0-9a-fA-F]+$/.test(id);
    if(!isHexString || id.length != 24)
     throw new NotFoundException("invalid Gym ID");
  }

  async findAll(req : any) : Promise<gym[]> {
    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");
    const gyms = await this.gymModel.find().exec();
    let listGyms : gym[] = [] ;
    gyms.map(gymJson => {
      listGyms.push(new gym(gymJson));
    });
    return  listGyms;
  }

  async findOne(req: any) : Promise<gym> {
    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    const currrentGym = await this.gymModel.findOne({_id: req.user.gym}).exec();
    if(isEmpty(currrentGym)) throw new NotFoundException("gym doesn't exist");

    const Gym : gym = new gym(currrentGym);
    return Gym;
  }

  async update(req: any, updateGymDto: UpdateGymDto) : Promise<any> {

    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    const foundDocument = await this.gymModel.findOne({ _id: req.user.gym}).exec();
    if(isEmpty(foundDocument)) throw new NotFoundException("gym doesn't exist");
    const currentgym : gym = new gym(updateGymDto);
    const updatedGym = await this.gymModel.findByIdAndUpdate(
      {_id : req.user.gym},
      {$set: currentgym},
      {new: true},
    )
    if(!isEmpty(updatedGym)) return {"message" : "gym updated successfully"};
    else throw new NotFoundException("updating gym denied");
  }

  async deleteAllUsersById(UsersIDs: string[]): Promise<void> {
    await this.userModel.deleteMany({ _id: { $in: UsersIDs } });
  }

  async deleteAllSubscriptionsById(SubsIDs: string[]): Promise<void> {
    await this.subscriptionModel.deleteMany({ _id: { $in: SubsIDs } });
  }

  async deleteAllEquipmentsById(EquipIDs: string[]): Promise<void> {
    await this.equipmentModel.deleteMany({ _id: { $in: EquipIDs } });
  }

  async deleteAllCoursesById(CourseIDs: string[]): Promise<void> {
    await this.courseModel.deleteMany({ _id: { $in: CourseIDs } });
  }

  async remove(id: string) : Promise<any> {
    this.verifValidId(id);
    const deletedGym = await this.gymModel.findByIdAndDelete({_id : id});
    if(deletedGym){ 
      await this.deleteAllUsersById(deletedGym.users);
      await this.deleteAllSubscriptionsById(deletedGym.subscriptions);
      await this.gymConfigService.remove(deletedGym.gymConfig);
      await this.deleteAllEquipmentsById(deletedGym.equipments);
      await this.deleteAllCoursesById(deletedGym.courses);
      return {"message" : "gym deleted successfully"};
    } 
    else throw new NotFoundException("gym doesn't exist");
  }

  async getUserListByGym(gym : string) : Promise<string[]>{
    const currrentGym = await this.gymModel.findOne({_id: gym}).exec();
    const myList = currrentGym.users;
    return myList;
  }
  async subscriptionsWeekAgo(users : string[]) : Promise<number>{
    const now = new Date();
    let revenue : number = 0;
    const WeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
    const SubscriptionsWeekAgo = await this.subsMembershipModel.find({Member : {$in : users},createdAt : {$gte: WeekAgo, $lte : now}}).exec();
    for(const LastWeekSubs of SubscriptionsWeekAgo)
    revenue += LastWeekSubs.Price;

    return revenue;
  }

  async subscriptions2WeekAgo(users : string[]) : Promise<number>{
    const now = new Date();
    let revenue : number = 0;
    const TwoWeekAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000); // 14 days in milliseconds
    const SubscriptionsWeekAgo = await this.subsMembershipModel.find({Member : {$in : users},createdAt : {$gte: TwoWeekAgo, $lte : now}}).exec();
    for(const Last2WeeksSubs of SubscriptionsWeekAgo)
    revenue += Last2WeeksSubs.Price;

    return revenue;
  }

  async subscriptions3WeekAgo(users : string[]) : Promise<number>{
    const now = new Date();
    let revenue : number = 0;
    const ThreeWeekAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000); // 21 days in milliseconds
    const SubscriptionsWeekAgo = await this.subsMembershipModel.find({Member : {$in : users},createdAt : {$gte: ThreeWeekAgo, $lte : now}}).exec();
    for(const Last3WeekSubs of SubscriptionsWeekAgo)
    revenue += Last3WeekSubs.Price;

    return revenue;
  }

  async subscriptionsMonthAgo(users : string[]) : Promise<number>{
    const now = new Date();
    let revenue : number = 0;
    const MonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds
    const SubscriptionsWeekAgo = await this.subsMembershipModel.find({Member : {$in : users},createdAt : {$gte: MonthAgo, $lte : now}}).exec();
    for(const LastMonthSubs of SubscriptionsWeekAgo)
    revenue += LastMonthSubs.Price;

    return revenue;
  }

  async RegistrationsWeekAgo(users : string[]) : Promise<number>{
    const now = new Date();
    const WeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
    let revenue : number = 0;
    const RegistrationWeekAgo = await this.registrationModel.find({Member : {$in : users},createdAt : {$gte: WeekAgo, $lte : now}})
    for(const LastWeekCourses of RegistrationWeekAgo)
    {
      const priceCourse = await this.courseModel.findOne({_id : LastWeekCourses.Course});
      revenue += priceCourse.PricePerMonth;
    }
    return revenue;
  }

  async Registrations2WeekAgo(users : string[]) : Promise<number>{
    const now = new Date();
    const TwoWeekAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000); // 14 days in milliseconds
    let revenue : number = 0;
    const Registration2WeekAgo = await this.registrationModel.find({Member : {$in : users},createdAt : {$gte: TwoWeekAgo, $lte : now}})
    for(const Last2WeeksCourses of Registration2WeekAgo)
    {
      const priceCourse = await this.courseModel.findOne({_id : Last2WeeksCourses.Course});
      revenue += priceCourse.PricePerMonth;
    }
    return revenue;
  }

  async Registrations3WeekAgo(users : string[]) : Promise<number>{
    const now = new Date();
    const ThreeWeekAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000); // 21 days in milliseconds
    let revenue : number = 0;
    const Registration3WeekAgo = await this.registrationModel.find({Member : {$in : users},createdAt : {$gte: ThreeWeekAgo, $lte : now}})
    for(const Last3WeeksCourses of Registration3WeekAgo)
    {
      const priceCourse = await this.courseModel.findOne({_id : Last3WeeksCourses.Course});
      revenue += priceCourse.PricePerMonth;
    }
    return revenue;
  }

  async RegistrationsMonthAgo(users : string[]) : Promise<number>{
    const now = new Date();
    const MonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds
    let revenue : number = 0;
    const RegistrationMonthAgo = await this.registrationModel.find({Member : {$in : users},createdAt : {$gte: MonthAgo, $lte : now}})
    for(const LastMonthCourses of RegistrationMonthAgo)
    {
      const priceCourse = await this.courseModel.findOne({_id : LastMonthCourses.Course});
      revenue += priceCourse.PricePerMonth;
    }
    return revenue;
  }

  async RevenuesGymWeekAgo(users : string[]) : Promise<number>{
    let sum : number = await this.subscriptionsWeekAgo(users) + await this.RegistrationsWeekAgo(users);
    return sum;
  }

  async RevenuesGym2WeekAgo(users : string[]) : Promise<number>{
    let sum : number = await this.subscriptions2WeekAgo(users) + await this.Registrations2WeekAgo(users);
    return sum;
  }

  async RevenuesGym3WeekAgo(users : string[]) : Promise<number>{
    let sum : number = await this.subscriptions3WeekAgo(users) + await this.Registrations3WeekAgo(users);
    return sum;

  }

  async RevenuesGymMonthAgo(users : string[]) : Promise<number>{
    let sum : number = await this.subscriptionsMonthAgo(users) + await this.RegistrationsMonthAgo(users);
    return sum;
  }

   async TotalRevenuesGym(users : string[]) : Promise<number>{
    let Revenue : number = await this.TotalRevenuesCourses(users) + await this.TotalRevenuesSubscriptions(users);
    return Revenue;
  }


  async TotalRevenuesCourses(users : string[]) : Promise<number>{
    const AllRegistration = await this.registrationModel.find({Member : {$in : users}}).exec();
    let sum : number = 0;
    for (const revenueCourse of AllRegistration)
    {
      const priceCourse = await this.courseModel.findOne({_id : revenueCourse.Course});
      sum += priceCourse.PricePerMonth;
    }
    return sum;
  }

  async TotalRevenuesSubscriptions(users : string[]) : Promise<number>{
    const AllMemberships = await this.subsMembershipModel.find({Member : {$in : users}}).exec();
    let sum : number = 0;
    for(const revenueMembership of AllMemberships)
      sum += revenueMembership.Price;

    return sum;
  }


  async AllStatistics(req : any) : Promise<any>
  {
    const UserList = await this.getUserListByGym(req.user.gym);

    const AllMemberships = await this.subsMembershipModel.find({Member : {$in : UserList}}).exec();

    let TotalRevenuesSubscriptions : number = await this.TotalRevenuesSubscriptions(UserList);
    let TotalRevenuesCourses : number = await this.TotalRevenuesCourses(UserList);
    
    let TotalActiveMembers : number = 0;
    let TotalInactiveMembers : number = 0;

    let RegistrationsMonthAgo : number =  await this.RegistrationsMonthAgo(UserList);
    let subscriptionsMonthAgo : number = await this.subscriptionsMonthAgo(UserList);

    let RegistrationsWeekAgo : number = await this.RegistrationsWeekAgo(UserList);
    let subscriptionsWeekAgo : number = await this.subscriptionsWeekAgo(UserList);
    let TotalRevenuesGym : number = await this.TotalRevenuesGym(UserList);

    
    const MembersActiveSubscriptions = await this.subsMembershipModel.countDocuments({Member : {$in : UserList},IsActive : true})
    const MembersInActiveSubscriptions = await this.userModel.countDocuments({Role : Role.MEMBER})
      
      TotalActiveMembers += MembersActiveSubscriptions;
      TotalInactiveMembers += MembersInActiveSubscriptions - TotalActiveMembers;

    return {
      TotalRevenuesSubscriptions,
      TotalRevenuesCourses,
      RegistrationsMonthAgo,
      subscriptionsMonthAgo,
      RegistrationsWeekAgo,
      subscriptionsWeekAgo,
      TotalActiveMembers,
      TotalInactiveMembers,
      TotalRevenuesGym
    }
  }

  async AllStatisticsChart(req : any) : Promise<any[]>
  {
    const UserList = await this.getUserListByGym(req.user.gym);

    let RevenueSubscriptionPerWeek = await this.subscriptionsWeekAgo(UserList);
    let RevenueSubscriptionPer2Week = await this.subscriptions2WeekAgo(UserList);
    let RevenueSubscriptionPer3Week = await this.subscriptions3WeekAgo(UserList);
    let RevenueSubscriptionPerMonth = await this.subscriptionsMonthAgo(UserList);

    let RevenueCoursesPerWeek = await this.RegistrationsWeekAgo(UserList);
    let RevenueCoursesPer2Week = await this.Registrations2WeekAgo(UserList);
    let RevenueCoursesPer3Week = await this.Registrations3WeekAgo(UserList);
    let RevenueCoursesPerMonth = await this.RegistrationsMonthAgo(UserList);

    let RevenueGymPerWeek = await this.RevenuesGymWeekAgo(UserList);
    let RevenueGymPer2Week = await this.RevenuesGym2WeekAgo(UserList);
    let RevenueGymPer3Week = await this.RevenuesGym3WeekAgo(UserList);
    let RevenueGymPerMonth = await this.RevenuesGymMonthAgo(UserList);

    let StatisticsCharts  : any[] = [
      {
        "Time" : "1 Week Ago",
        "SubscriptionsMembers" : RevenueSubscriptionPerWeek,
        "CoursesMembers" : RevenueCoursesPerWeek,
        "RevenueGym" : RevenueGymPerWeek
      },
      {
        "Time" : "2 Weeks Ago",
        "SubscriptionsMembers" : RevenueSubscriptionPer2Week,
        "CoursesMembers" : RevenueCoursesPer2Week,
        "RevenueGym" : RevenueGymPer2Week
      },
      {
        "Time" : "3 Weeks Ago",
        "SubscriptionsMembers" : RevenueSubscriptionPer3Week,
        "CoursesMembers" : RevenueCoursesPer3Week,
        "RevenueGym" : RevenueGymPer3Week
      },
      {
        "Time" : "1 Month Ago",
        "SubscriptionsMembers" : RevenueSubscriptionPerMonth,
        "CoursesMembers" : RevenueCoursesPerMonth,
        "RevenueGym" : RevenueGymPerMonth
      }
    ]

    return StatisticsCharts;
  }
}
