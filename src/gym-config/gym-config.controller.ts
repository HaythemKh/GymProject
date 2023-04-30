import { Controller, Get, Post, Body, Patch, Param, Delete,Request, UseGuards } from '@nestjs/common';
import { GymConfigService } from './gym-config.service';
import { CreateGymConfigDto } from './dto/create-gym-config.dto';
import { UpdateGymConfigDto } from './dto/update-gym-config.dto';
import { gymConfig } from './Model/gymConfig.model';
import { AuthGuard } from '@nestjs/passport';

@Controller('gymConfig')
export class GymConfigController {
  constructor(private readonly gymConfigService: GymConfigService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get('MyGymConfig')
  async findOne(@Request() req: any) : Promise<gymConfig[]> {
    return await this.gymConfigService.findOne(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch('UpdateGymConfig')
  update(@Request() req: any, @Body() updateGymConfigDto: UpdateGymConfigDto) {
    return this.gymConfigService.update(req, updateGymConfigDto);
  }
}
