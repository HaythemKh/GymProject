import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'class-validator';
import { Model } from 'mongoose';
import { EquipmentService } from 'src/equipment/equipment.service';
import { GymConfigService } from 'src/gym-config/gym-config.service';
import { gymConfig } from 'src/gym-config/Model/gymConfig.model';
import { GymService } from 'src/gym/gym.service';
import { Equipment, EquipmentDocument } from 'src/Schemas/equipment.models';
import { Reservation, ReservationDocument } from 'src/Schemas/reservation.models';
import { Person, Role, UserDocument } from 'src/Schemas/users.models';
import { SubsMembershipService } from 'src/subs-membership/subs-membership.service';
import { UsersService } from 'src/users/users.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { reservation } from './Model/reservation.model';211115

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

  ){}

  async create(createReservationDto: CreateReservationDto, req : any) : Promise<any> {

    if(req.user.role !== Role.MEMBER) throw new UnauthorizedException("Only Member can reservate a specific equipment !!");
    if(!this.SubsMemberService.IsSubscribed(req.user.sub)) throw new BadRequestException("Please purchase a subscription before making a reservation.");
    createReservationDto.User = req.user.sub;

    let reserve : reservation = new reservation(createReservationDto);
    reserve.setStartDate(createReservationDto.Start_time)
    reserve.setEndDate(createReservationDto.End_time)

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
      reserveStartHour > hourClose ||
      (reserveStartHour === hourOpen && reserveStartMinutes < minuteOpen) ||
      reserveEndHour > hourClose ||
      (reserveEndHour === hourClose && reserveEndMinutes >= minuteClose)
      ) 
      throw new BadRequestException("this Gym is Closed at this time it Open at " + gymconfig.OpeningTime + "and cloed at " + gymconfig.ClosingTime);

    const verifexist = await this.reservationModel.findOne({Equipment :createReservationDto.Equipment ,Start_time :reserve.Start_time,End_time : reserve.End_time });
    if(verifexist) throw new NotFoundException("this equipment is reservated at this time");

    const verif2 = await this.reservationModel.findOne({Equipment :createReservationDto.Equipment ,Start_time :{ $gte: reserve.Start_time, $lt: reserve.End_time }});
    const verif3 = await this.reservationModel.findOne({Equipment :createReservationDto.Equipment ,End_time : { $gt: reserve.Start_time, $lte: reserve.End_time } });
    if(verif2 || verif3) throw new BadRequestException('Equipment is not available during the specified time slot.');

    const created = await this.reservationModel.create(reserve);
    if(!created) throw new NotFoundException("problem with reservation");

    return {"message" : "Reservation added successfully"};

  }

  isDate(value : any) : boolean{
    return value instanceof Date && !isNaN(value.getTime());
  }

  validateDate(dateString: string): boolean {
    const date = new Date(dateString);
    return this.isDate(date);
  }

  validateReservation(data : CreateReservationDto, dateStart : Date, dateEnd : Date) : any
  {
    this.equipmentService.verifValidId(data.Equipment);

    if(!this.usersService.IsUserExist(data.User)) throw new NotFoundException("User doesn't exist!");
    if(!this.equipmentService.IsEquipmentExist(data.Equipment)) throw new NotFoundException("Equipment doesn't Exist!");

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

    return `This action updates a #${id} reservation`;
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
