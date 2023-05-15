import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { equipment } from './Model/equipment.model';
import { AuthGuard } from '@nestjs/passport';

@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("/CreateEquipment")
  async create(@Body() createEquipmentDto: CreateEquipmentDto,@Request() req : any) : Promise<any> {
    return await this.equipmentService.create(createEquipmentDto, req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/AllEquipments")
  async findAll(@Request() req : any) : Promise<equipment[]> {
    return await this.equipmentService.findAll(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(':id')
  async findOne(@Param('id') id: string,@Request() req : any) : Promise<equipment> {
    return await this.equipmentService.findOne(id,req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEquipmentDto: UpdateEquipmentDto,@Request() req : any) : Promise<any> {
    return await this.equipmentService.update(id, updateEquipmentDto,req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(':id')
  async remove(@Param('id') id: string,@Request() req : any) : Promise<any> {
    return this.equipmentService.remove(id,req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/Member/AllAvailableEquipments")
  async AllEquipmentAvailable(@Request() req:any) : Promise<equipment[]>
  {
    return this.equipmentService.AvailableEquipment(req);
  }
}
