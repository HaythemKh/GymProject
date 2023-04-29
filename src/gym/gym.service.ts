import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'class-validator';
import { Model } from 'mongoose';
import { CreateGymConfigDto } from 'src/gym-config/dto/create-gym-config.dto';
import { GymConfigService } from 'src/gym-config/gym-config.service';
import { Course, CourseDocument } from 'src/Schemas/course.models';
import { Equipment, EquipmentDocument } from 'src/Schemas/equipment.models';
import { Gym, GymDocument } from 'src/Schemas/gym.models';
import { Subscription, SubscriptionDocument } from 'src/Schemas/subscription.models';
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
  ){}
  
  async create(createGymDto: CreateGymDto, req :any) : Promise<any> {
    
    let {OpeningTime,ClosingTime,Logo,Color} = createGymDto;
    let myOpeneningtime = OpeningTime;OpeningTime = new Date(Date.parse(`01/01/2000 ${myOpeneningtime}`));
    let myClosingtime = ClosingTime;ClosingTime = new Date(Date.parse(`01/01/2000 ${myClosingtime}`));

    const createConfig : CreateGymConfigDto = {OpeningTime,ClosingTime,Logo,Color};

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
      {$set: updateGymDto},
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
}
