import { Controller, Get, Post, Body, Patch, Param, Delete,Request, UseGuards } from '@nestjs/common';
import { SubsMembershipService } from './subs-membership.service';
import { CreateSubsMembershipDto } from './dto/create-subs-membership.dto';
import { UpdateSubsMembershipDto } from './dto/update-subs-membership.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('subsMembership')
export class SubsMembershipController {
  constructor(private readonly subsMembershipService: SubsMembershipService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("CreateSubsMembership")
  async create(@Body() createSubsMembershipDto: CreateSubsMembershipDto,@Request() req : any) : Promise<any> {
    return await this.subsMembershipService.create(createSubsMembershipDto,req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("AllMemberships")
  async findAll(@Request() req : any) : Promise<any> {
    return await this.subsMembershipService.findAll(req);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) : Promise<any>{
    return await this.subsMembershipService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSubsMembershipDto: UpdateSubsMembershipDto) : Promise<any> {
    return await this.subsMembershipService.update(id, updateSubsMembershipDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) :Promise<any> {
    return await this.subsMembershipService.remove(id);
  }
}
