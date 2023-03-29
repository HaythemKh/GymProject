import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'class-validator';
import { Model } from 'mongoose';
import { EquipmentService } from 'src/equipment/equipment.service';
import { Reservation, ReservationDocument } from 'src/Schemas/reservation.models';
import { UsersService } from 'src/users/users.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { reservation } from './Model/reservation.model';

@Injectable()
export class ReservationService {

  constructor(
    @InjectModel(Reservation.name) private reservationModel : Model<ReservationDocument>,
    @Inject(EquipmentService) private  equipmentService : EquipmentService,
    @Inject(UsersService) private  usersService : UsersService
  ){}

  async create(createReservationDto: CreateReservationDto) : Promise<any> {
    this.validateReservation(createReservationDto);

    const verifexist = await this.reservationModel.findOne({Equipment :createReservationDto.Equipment ,Start_time :createReservationDto.Start_time,End_time : createReservationDto.End_time });
    if(verifexist) throw new NotFoundException("this equipment is reservated at this time");
    let reserve : reservation = new reservation(createReservationDto);
    reserve.setStartDate(createReservationDto.Start_time)
    reserve.setEndDate(createReservationDto.End_time)

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

  validateReservation(data : CreateReservationDto) : any
  {
    this.equipmentService.verifValidId(data.Equipment);
    this.usersService.verifValidId(data.User)
    if(!this.usersService.IsUserExist(data.User)) throw new NotFoundException("User doesn't exist!");
    if(!this.equipmentService.IsEquipmentExist(data.Equipment)) throw new NotFoundException("Equipment doesn't Exist!");

    if(!this.validateDate(data.Start_time)) throw new NotFoundException('Invalid start time!');
    if(!this.validateDate(data.End_time)) throw new NotFoundException('Invalid start time!');

    const date1 = new Date(data.Start_time);
    const date2 = new Date(data.End_time);

    if(new Date() > date1)throw new NotFoundException("Current date is greater than reservation start time");
    if( new Date() > date2)throw new NotFoundException("Current date is greater than reservation End time");


    const diffInMs = date2.getTime() - date1.getTime(); // Subtract second date from first date
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // Convert to minutes and round down

    if(diffInMinutes != 30) throw new NotFoundException('Time of reservation must be 30 Minutes');
    //console.log(diffInMinutes); // Output: 30
  }

  verifValidId(id: string){
    const isHexString = /^[0-9a-fA-F]+$/.test(id);
    if(!isHexString || id.length != 24)
     throw new NotFoundException("invalid Reservation ID");
  }
  async findAll() : Promise<reservation[]> {
    const AllReservations = await this.reservationModel.find().exec();
    let listReservations : reservation[] = [] ;
    AllReservations.map(ReservationJson => {
      listReservations.push(new reservation(ReservationJson));
    });

    return  listReservations;
  }

  async findOne(id: string) : Promise<reservation> {
    this.verifValidId(id);
    const ReservationModel = await this.reservationModel.findOne({_id : id}).exec();
    if(isEmpty(ReservationModel)) throw new NotFoundException("Reservation doesn't exist");
    const Reservation : reservation = new reservation(ReservationModel);
    return  Reservation;
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  async remove(id: string) : Promise<any> {
    this.verifValidId(id);
    const deletedReservation = await this.reservationModel.findByIdAndDelete({_id : id});
    if(deletedReservation) return {"message" : "Reservation deleted successfully"};
    else throw new NotFoundException("Reservation doesn't exist");
  }
}
