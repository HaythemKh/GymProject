import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GymConfigService } from './gym-config.service';
import { CreateGymConfigDto } from './dto/create-gym-config.dto';
import { UpdateGymConfigDto } from './dto/update-gym-config.dto';
import { gymConfig } from './Model/gymConfig.model';

@Controller('gymConfig')
export class GymConfigController {
  constructor(private readonly gymConfigService: GymConfigService) {}

  @Get('/:id')
  async findOne(@Param('id') id: string) : Promise<gymConfig> {
    return await this.gymConfigService.findOne(id);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateGymConfigDto: UpdateGymConfigDto) {
    return this.gymConfigService.update(id, updateGymConfigDto);
  }
}
