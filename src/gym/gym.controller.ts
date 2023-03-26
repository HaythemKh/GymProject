import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GymService } from './gym.service';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { gym } from './Model/gym.model';

@Controller('gym')
export class GymController {
  constructor(private readonly gymService: GymService) {}

  @Post("createGym")
  async create(@Body() createGymDto: CreateGymDto) : Promise<any> {
    return await this.gymService.create(createGymDto);
  }

  @Get("AllGyms")
  async findAll() : Promise<gym[]> {
    return await this.gymService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) : Promise<gym> {
    return await this.gymService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGymDto: UpdateGymDto) : Promise<gym> {
    return await this.gymService.update(id, updateGymDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) : Promise<any> {
    return await this.gymService.remove(id);
  }
}
