import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'class-validator';
import { Model } from 'mongoose';
import { EquipmentService } from 'src/equipment/equipment.service';
import { GymConfigService } from 'src/gym-config/gym-config.service';
import { gymConfig } from 'src/gym-config/Model/gymConfig.model';
import { GymService } from 'src/gym/gym.service';
import { Course, CourseDocument } from 'src/Schemas/course.models';
import { Equipment, EquipmentDocument } from 'src/Schemas/equipment.models';
import { Reservation, ReservationDocument } from 'src/Schemas/reservation.models';
import { SubsMembership, SubsMembershipDocument } from 'src/Schemas/subsmembership.models';
import { Person, Role, UserDocument } from 'src/Schemas/users.models';
import { SubsMembershipService } from 'src/subs-membership/subs-membership.service';
import { UsersService } from 'src/users/users.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { reservation } from './Model/reservation.model';

@Injectable()
export class ReservationService {

  constructor(
    @InjectModel(Reservation.name) private reservationModel : Model<ReservationDocument>,
    @Inject(EquipmentService) private  equipmentService : EquipmentService,
    @Inject(UsersService) private  usersService : UsersService,
    @Inject(GymService) private  gymService : GymService,
    @InjectModel(Equipment.name) private EquipmentModel : Model<EquipmentDocument>,
    @InjectModel(Person.name) private userModel : Model<UserDocument>,
    @Inject(GymConfigService) private  gymConfigService : GymConfigService,
    @Inject(SubsMembershipService) private  SubsMemberService : SubsMembershipService,
    @InjectModel(Course.name) private CourseModel : Model<CourseDocument>,
  ){}

  async create(createReservationDto: CreateReservationDto, req : any) : Promise<any> {

    if(req.user.role !== Role.MEMBER) throw new UnauthorizedException("Only Member can reservate a specific equipment !!");
     if(!await this.SubsMemberService.isSubscribed(req.user.sub)) throw new BadRequestException("Please purchase a subscription before making a reservation.");
     createReservationDto.User = req.user.sub;
    let reserve : reservation = new reservation(createReservationDto);
    reserve.setStartDate(createReservationDto.Start_time)
    reserve.setEndDate(createReservationDto.End_time)

      this.equipmentService.verifValidId(reserve.Equipment);
      if(!this.usersService.IsUserExist(reserve.User)) throw new NotFoundException("User doesn't exist!");
      if(!this.equipmentService.IsEquipmentExist(reserve.Equipment)) throw new NotFoundException("Equipment doesn't Exist!");  

    this.validateReservation(createReservationDto,reserve.Start_time,reserve.End_time);

    const gymconfig = await this.gymConfigService.findOneGym(req.user.gym);
    const convertorOpening : string = `${gymconfig.OpeningTime}`;
    const convertorClosing : string = `${gymconfig.ClosingTime}`;
    const [h1, m1] = convertorOpening.split(':');
    const [h2, m2] = convertorClosing.split(':');
    const hourOpen = Number(h1);
    const minuteOpen = Number(m1);
    const hourClose = Number(h2);
    const minuteClose = Number(m2);

    const reserveStartHour = reserve.Start_time.getUTCHours();
    const reserveStartMinutes = reserve.Start_time.getUTCMinutes();
    const reserveEndHour = reserve.End_time.getUTCHours();
    const reserveEndMinutes = reserve.End_time.getUTCMinutes();
    if (
      reserveStartHour < hourOpen ||
      (reserveStartHour === hourOpen && reserveStartMinutes < minuteOpen) ||
      reserveEndHour > hourClose ||
      (reserveEndHour === hourClose && reserveEndMinutes > minuteClose)
      ) 
      throw new BadRequestException("this Gym is Closed at this time it Open at " + gymconfig.OpeningTime + "and closed at " + gymconfig.ClosingTime);
      
    const verifexist = await this.reservationModel.findOne({Equipment :createReservationDto.Equipment ,Start_time :reserve.Start_time,End_time : reserve.End_time });
    if(verifexist) throw new NotFoundException("this equipment is reservated at this time");

    const verif2 = await this.reservationModel.findOne({Equipment :createReservationDto.Equipment ,Start_time :{ $gte: reserve.Start_time, $lt: reserve.End_time }});
    const verif3 = await this.reservationModel.findOne({Equipment :createReservationDto.Equipment ,End_time : { $gt: reserve.Start_time, $lte: reserve.End_time } });
    if(verif2 || verif3) throw new BadRequestException('Equipment is not available during the specified time slot.');
    let StartTime = new Date(Date.parse(`01/01/2000`));
    StartTime.setUTCMinutes(reserve.Start_time.getUTCMinutes());
    StartTime.setUTCHours(reserve.Start_time.getUTCHours());

    let EndTime = new Date(Date.parse(`01/01/2000`));
    EndTime.setUTCMinutes(reserve.End_time.getUTCMinutes());
    EndTime.setUTCHours(reserve.End_time.getUTCHours());

    if(await this.verifCourseEquipmentTimes(reserve.Equipment,reserve.Start_time.getDay(),StartTime,EndTime))
    throw new BadRequestException("This equipment reserved by course in this time");

    const created = await this.reservationModel.create(reserve);
    if(!created) throw new BadRequestException("problem with reservation");

    return {"message" : "Reservation added successfully"};
  }

  async verifCourseEquipmentTimes(equipment : any, day : number, StartTime : Date, EndTime : Date) : Promise<Boolean>{
    const verif1 = await this.CourseModel.find({Equipments : { $in : equipment},StartDate : StartTime,EndDate : EndTime , daysOfWeek : { $in : day}});
    const verif2 = await this.CourseModel.find({Equipments : { $in : equipment},StartDate : { $gte: StartTime, $lt: EndTime}, daysOfWeek : { $in : day}});
    const verif3 = await this.CourseModel.find({Equipments : { $in : equipment},EndDate : { $gt: StartTime, $lte: EndTime }, daysOfWeek : { $in : day}});

    return verif1.length > 0 || verif2.length > 0 || verif3.length > 0;
  }


  isDate(value : any) : boolean{
    return value instanceof Date && !isNaN(value.getTime());
  }

  validateDate(dateString: string): boolean {
    const date = new Date(dateString);
    return this.isDate(date);
  }

  validateReservation(data : any, dateStart : Date, dateEnd : Date) : any
  {

    if(!this.validateDate(data.Start_time)) throw new NotFoundException('Invalid start time!');

    if(!this.validateDate(data.End_time)) throw new NotFoundException('Invalid start time!');

    const date1 = dateStart;

    const date2 = dateEnd;

    const now = new Date();
    now.setHours(now.getHours() + 1);

    if( now > date1)throw new NotFoundException("Current date is greater than reservation start time");
    if( now > date2)throw new NotFoundException("Current date is greater than reservation End time");

    const diffInMsDateNow =  date1.getTime() - now.getTime(); // Subtract first date from  date now
    const diffInMinutesNow = Math.floor(diffInMsDateNow / (1000 * 60)); // Convert to minutes and round down

    if(diffInMinutesNow < 30) throw new NotFoundException("Choose a reservation time greater than our time now by 30 Minutes");

    const diffInMs = date2.getTime() - date1.getTime(); // Subtract second date from first date
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // Convert to minutes and round down

    if(diffInMinutes != 30) throw new NotFoundException('Time of reservation must be 30 Minutes');
  }


  async validationUpdateReservation(updateReservationDto : UpdateReservationDto,req : any,previousReservation : reservation) : Promise<any>{

    if(!updateReservationDto.Start_time || !updateReservationDto.End_time )
    {
      updateReservationDto.Start_time = undefined;
      updateReservationDto.End_time = undefined;
    }

    if(updateReservationDto.Start_time && updateReservationDto.End_time)
    {
      if(!updateReservationDto.Equipment)
      updateReservationDto.Equipment = previousReservation.Equipment;
      const reserve : reservation = new reservation(updateReservationDto);
      reserve.setStartDate(updateReservationDto.Start_time);
      reserve.setEndDate(updateReservationDto.End_time);
      
      if(updateReservationDto.Equipment)
      {
        this.equipmentService.verifValidId(updateReservationDto.Equipment);
        if(!this.equipmentService.IsEquipmentExist(updateReservationDto.Equipment)) throw new NotFoundException("Equipment doesn't Exist!");
      }
      if(updateReservationDto.User)
      {
        this.usersService.verifValidId(updateReservationDto.User);

        if(!this.usersService.IsUserExist(updateReservationDto.User)) throw new NotFoundException("User doesn't exist!");

        if(!this.SubsMemberService.isSubscribed(updateReservationDto.User)) throw new BadRequestException("Member doesn't have a subscription.");
      }

      await this.validateReservation(reserve,reserve.Start_time,reserve.End_time);

    const gymconfig = await this.gymConfigService.findOneGym(req.user.gym);
    const convertorOpening : string = `${gymconfig.OpeningTime}`;
    const convertorClosing : string = `${gymconfig.ClosingTime}`;
    const [h1, m1] = convertorOpening.split(':');
    const [h2, m2] = convertorClosing.split(':');
    const hourOpen = Number(h1);
    const minuteOpen = Number(m1);
    const hourClose = Number(h2);
    const minuteClose = Number(m2);

    const reserveStartHour = reserve.Start_time.getUTCHours();
    const reserveStartMinutes = reserve.Start_time.getUTCMinutes();
    const reserveEndHour = reserve.End_time.getUTCHours();
    const reserveEndMinutes = reserve.End_time.getUTCMinutes();
    if (
      reserveStartHour < hourOpen ||
      (reserveStartHour === hourOpen && reserveStartMinutes < minuteOpen) ||
      reserveEndHour > hourClose ||
      (reserveEndHour === hourClose && reserveEndMinutes > minuteClose)
      ) 
      throw new BadRequestException("this Gym is Closed at this time it Open at " + gymconfig.OpeningTime + "and closed at " + gymconfig.ClosingTime);
      

    const verifexist = await this.reservationModel.findOne({Equipment :reserve.Equipment ,Start_time :reserve.Start_time,End_time : reserve.End_time });
    if(verifexist) throw new NotFoundException("this equipment is reservated at this time");
 
    let verif2 = await this.reservationModel.findOne({Equipment :reserve.Equipment ,Start_time :{ $gte: reserve.Start_time, $lt: reserve.End_time }});
    const verif3 = await this.reservationModel.findOne({Equipment :reserve.Equipment ,End_time : { $gt: reserve.Start_time, $lte: reserve.End_time } });
    if(verif2 || verif3) throw new BadRequestException('Equipment is not available during the specified time slot.');
    
    let StartTime = new Date(Date.parse(`01/01/2000`));
    StartTime.setUTCMinutes(reserve.Start_time.getUTCMinutes());
    StartTime.setUTCHours(reserve.Start_time.getUTCHours());

    let EndTime = new Date(Date.parse(`01/01/2000`));
    EndTime.setUTCMinutes(reserve.End_time.getUTCMinutes());
    EndTime.setUTCHours(reserve.End_time.getUTCHours());

    if(await this.verifCourseEquipmentTimes(reserve.Equipment,reserve.Start_time.getDay(),StartTime,EndTime))
    throw new BadRequestException("This equipment reserved by course in this time");

    }
  }

  verifValidId(id: string){
    const isHexString = /^[0-9a-fA-F]+$/.test(id);
    if(!isHexString || id.length != 24)
     throw new NotFoundException("invalid Reservation ID");
  }
  async findAll(req : any) : Promise<any[]> {

    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    const UserList = await this.gymService.getUserListByGym(req.user.gym);
    const AllReservations = await this.reservationModel.find({User : {$in : UserList}});
    const results = [];
    for (const reservation of AllReservations) {
      const Member = await this.userModel.findById(reservation.User);
      const Equipment = await this.EquipmentModel.findById(reservation.Equipment);

      if (Member && Equipment) {
        const combinedData = {
          ...reservation.toObject(),
          MemberName: Member.firstName,
          MemberLastName: Member.lastName,
          EquipmentName : Equipment.Name,
          EquipmentImage : Equipment.Image
        };
      results.push(combinedData);
    }
  }
    return  results;
  }

  async findOne(id: string,req : any) : Promise<reservation> {

    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    this.verifValidId(id);
    const ReservationModel = await this.reservationModel.findOne({_id : id}).exec();
    if(isEmpty(ReservationModel)) throw new NotFoundException("Reservation doesn't exist");
    const Reservation : reservation = new reservation(ReservationModel);
    return  Reservation;
  }

  async update(id: string, updateReservationDto: UpdateReservationDto,req : any) {

    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");
    this.verifValidId(id);
    const findDoc = await this.reservationModel.findOne({_id : id});
    if(isEmpty(findDoc)) throw new NotFoundException("reservation doesn't exist");
    let previousReservation : reservation = new reservation(findDoc);
    await this.validationUpdateReservation(updateReservationDto,req,previousReservation);
    let reserve : reservation = new reservation(updateReservationDto);
    if(updateReservationDto.Start_time && updateReservationDto.End_time)
    {
      reserve.setStartDate(updateReservationDto.Start_time);
      reserve.setEndDate(updateReservationDto.End_time);
    }
    const updatedReservation = await this.reservationModel.findByIdAndUpdate(
      {_id : findDoc._id},
      {$set: reserve},
      {new: true},
    )

    if(!isEmpty(updatedReservation)) return {"message" : "reservation updated successfully"};
    else throw new NotFoundException("updating reservation denied");

  }

  async remove(id: string,req : any) : Promise<any> {

    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    this.verifValidId(id);
    const deletedReservation = await this.reservationModel.findByIdAndDelete({_id : id});
    if(deletedReservation)
    {
      // this.equipmentService.updateEquipmentStatusToTrue(deletedReservation.Equipment);
      return {"message" : "Reservation deleted successfully"};
    } 
    else throw new NotFoundException("Reservation doesn't exist");
  }


  async MyReservations(req : any) : Promise<reservation[]>{
    if(req.user.role !== Role.MEMBER) throw new UnauthorizedException("Only Members can get Access to This !!");
    
    const EquipmentList = await this.gymService.getEquipmentListByGym(req.user.gym);

    const AllReservations = await this.reservationModel.find({User : req.user.sub,Equipment : {$in : EquipmentList}});
    const results = [];
    for (const reservation of AllReservations) {
      const Member = await this.userModel.findById(reservation.User);
      const Equipment = await this.EquipmentModel.findById(reservation.Equipment);

      if (Member && Equipment) {
        const combinedData = {
          ...reservation.toObject(),
          MemberName: Member.firstName,
          MemberLastName: Member.lastName,
          EquipmentName : Equipment.Name,
          EquipmentImage : Equipment.Image
        };
      results.push(combinedData);
      
    }
  }
    return  results;
  }
}
