import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EquipmentService } from 'src/equipment/equipment.service';
import { Reservation, ReservationDocument } from 'src/Schemas/reservation.models';
import { UsersService } from 'src/users/users.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationService {

  constructor(
    @InjectModel(Reservation.name) private reservationModel : Model<ReservationDocument>,
    @Inject(EquipmentService) private  equipmentService : EquipmentService,
    @Inject(UsersService) private  usersService : UsersService
  ){}

  async create(createReservationDto: CreateReservationDto) : Promise<any> {
    return 'This action adds a new reservation';
  }

  // findAll() {
  //   return `This action returns all reservation`;
  // }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
