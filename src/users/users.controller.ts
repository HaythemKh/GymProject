import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { admin } from './Models/admin.model';
import { member } from './Models/member.model';
import { trainer } from './Models/trainer.model';
import { User } from './Models/user.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/createUser')
  async create(@Body() createUserDto: CreateUserDto) : Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get("/AllUsers")
  async findAll() : Promise<User[]>{
    return await this.usersService.findAllUsers();
  }

  @Get("/AllAdmins")
  async findAllAdmins() : Promise<admin[]>{
    return await this.usersService.findAllAdmins();
  }

  @Get("/AllMembers")
  async findAllMembers() : Promise<member[]>{
    return await this.usersService.findAllMembers();
  }

  @Get("/AllTrainers")
  async findAllTrainers() : Promise<trainer[]>{
    return await this.usersService.findAllTrainers();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) : Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) : Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) : Promise<any> {
    return await this.usersService.remove(id);
  }

  @Post("/search")
  async Search(@Query('key') key)
  {
    return key;
  }
}
