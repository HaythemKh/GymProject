import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { equipment } from './Model/equipment.model';

@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post("/CreateEquipment")
  async create(@Body() createEquipmentDto: CreateEquipmentDto) : Promise<any> {
    return await this.equipmentService.create(createEquipmentDto);
  }

  @Get("/AllEquipments")
  async findAll() : Promise<equipment[]> {
    return await this.equipmentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) : Promise<equipment> {
    return await this.equipmentService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEquipmentDto: UpdateEquipmentDto) : Promise<any> {
    return await this.equipmentService.update(id, updateEquipmentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) : Promise<any> {
    return this.equipmentService.remove(id);
  }
}
