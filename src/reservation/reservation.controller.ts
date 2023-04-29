import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { reservation } from './Model/reservation.model';
import { AuthGuard } from '@nestjs/passport';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("/CreateReservation")
  async create(@Body() createReservationDto: CreateReservationDto,@Request() req : any) : Promise<any> {
    return await this.reservationService.create(createReservationDto,req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/AllReservations")
  async findAll(@Request() req : any) : Promise<reservation[]> {
    return await this.reservationService.findAll(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(':id')
  async findOne(@Param('id') id: string,@Request() req : any) : Promise<reservation> {
    return await this.reservationService.findOne(id,req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto,@Request() req : any) : Promise<any> {
    return await this.reservationService.update(id, updateReservationDto, req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(':id')
  async remove(@Param('id') id: string,@Request() req : any) : Promise<any> {
    return await this.reservationService.remove(id,req);
  }
}
