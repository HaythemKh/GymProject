import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { registration } from './Model/registration.model';
import { AuthGuard } from '@nestjs/passport';

@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("createRegistration")
  async createRegistration(@Body() createRegistrationDto: CreateRegistrationDto,@Request() req : any) : Promise<any> {
    return await this.registrationService.createRegistration(createRegistrationDto,req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("AllRegistration")
  async findAll(@Request() req : any) : Promise<any[]> {
    return await this.registrationService.findAll(req);
  }
 
  @UseGuards(AuthGuard("jwt"))
  @Get('/:id')
  async findOne(@Param('id') id: string,@Request() req : any) : Promise<registration> {
    return await this.registrationService.findOne(id,req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRegistrationDto: UpdateRegistrationDto,@Request() req : any) : Promise<any> {
    return await this.registrationService.update(id, updateRegistrationDto,req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete('/:id')
  async remove(@Param('id') id: string, @Request() req : any) : Promise<any> {
    return await this.registrationService.remove(id,req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("Member/MyPreviousRegistrations")
  async MyRegistrations(@Request() req : any) : Promise<registration[]>{
    return await this.registrationService.MyRegistrations(req);
  }
}
