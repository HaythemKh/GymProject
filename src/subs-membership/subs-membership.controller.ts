import { Controller, Get, Post, Body, Patch, Param, Delete,Request, UseGuards } from '@nestjs/common';
import { SubsMembershipService } from './subs-membership.service';
import { CreateSubsMembershipDto } from './dto/create-subs-membership.dto';
import { UpdateSubsMembershipDto } from './dto/update-subs-membership.dto';
import { AuthGuard } from '@nestjs/passport';
import { subsmembership } from './Model/subsmembership.model';
import { subscription } from 'src/subscription/Model/subscription.model';

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

  @UseGuards(AuthGuard("jwt"))
  @Get(':id')
  async findOne(@Param('id') id: string,@Request() req : any) : Promise<subsmembership>{
    return await this.subsMembershipService.findOne(id,req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSubsMembershipDto: UpdateSubsMembershipDto,@Request() req : any) : Promise<any> {
    return await this.subsMembershipService.update(id, updateSubsMembershipDto,req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(':id')
  async remove(@Param('id') id: string,@Request() req : any) :Promise<any> {
    return await this.subsMembershipService.remove(id,req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/Member/MyPreviousSubscriptions")
  async MySubscriptions(@Request() req : any) : Promise<subsmembership[]>{
    return await this.subsMembershipService.PreviousSubscriptions(req);
  }


  // @UseGuards(AuthGuard("jwt"))
  // @Get("/Member/LastOne")
  // async LastOne(@Request() req : any) : Promise<subsmembership>{
  //   return await this.subsMembershipService.LastOne(req);
  // }
}
