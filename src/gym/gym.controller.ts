import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request } from '@nestjs/common';
import { GymService } from './gym.service';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { gym } from './Model/gym.model';
import { AuthGuard } from '@nestjs/passport';

@Controller('gym')
export class GymController {
  constructor(private readonly gymService: GymService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("createGym")
  async create(@Body() createGymDto: CreateGymDto,@Request() req : any) : Promise<any> {
    return await this.gymService.create(createGymDto,req);
  }
  @UseGuards(AuthGuard("jwt"))
  @Get("AllGyms")
  async findAll(@Request() req : any) : Promise<gym[]> {
    return await this.gymService.findAll(req);
  }
  @UseGuards(AuthGuard("jwt"))
  @Get('MyGym')
  async findOne(@Request() req : any) : Promise<gym> {
    return await this.gymService.findOne(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch('UpdateGym')
  async update(@Request() req : any, @Body() updateGymDto: UpdateGymDto) : Promise<gym> {
    return await this.gymService.update(req, updateGymDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) : Promise<any> {
    return await this.gymService.remove(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/Statistics")
  async AllStatistics(@Request() req : any)
  {
    return await this.gymService.AllStatistics(req);
  }
}
