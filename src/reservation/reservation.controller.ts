import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { reservation } from './Model/reservation.model';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post("/CreateReservation")
  async create(@Body() createReservationDto: CreateReservationDto) : Promise<any> {
    return await this.reservationService.create(createReservationDto);
  }

  @Get("/AllReservations")
  async findAll() : Promise<reservation[]> {
    return await this.reservationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) : Promise<reservation> {
    return await this.reservationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationService.update(+id, updateReservationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) : Promise<any> {
    return await this.reservationService.remove(id);
  }
}
