import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { admin } from './Models/admin.model';
import { member } from './Models/member.model';
import { trainer } from './Models/trainer.model';
import { User } from './Models/user.model';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/createUser')
  async create(@Body() createUserDto: CreateUserDto,@Request() req : any) : Promise<User> {
    return await this.usersService.create(createUserDto,req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("/AllUsers")
  async findAll(@Request() req : any) : Promise<User[]>{
    return await this.usersService.findAllUsers(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("/AllAdmins")
  async findAllAdmins(@Request() req : any) : Promise<admin[]>{
    return await this.usersService.findAllAdmins(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("/AllMembers")
  async findAllMembers(@Request() req : any) : Promise<member[]>{
    return await this.usersService.findAllMembers(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("/AllTrainers")
  async findAllTrainers(@Request() req : any) : Promise<trainer[]>{
    return await this.usersService.findAllTrainers(req);
  }

  /**
   * Problem because when i sent only token he call this method before the info method this is why there is an error here
   * he took the id as a null
   * 
   * Working Now :)
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('/find/:id')
  async findOne(@Param('id') id: string,@Request() req : any) : Promise<User> {
    return await this.usersService.findOne(id,req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto,@Request() req : any) : Promise<User> {
    return await this.usersService.update(id, updateUserDto,req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("/MyProfile")
  async PersonalInformation(@Request() req : any) : Promise<any> {
    return await this.usersService.PersonalInformation(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async remove(@Param('id') id: string,@Request() req : any) : Promise<any> {
    return await this.usersService.remove(id,req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/MyProfile/Update')
  async updateProfile(@Body() updateUserDto: UpdateUserDto,@Request() req : any) : Promise<any> {
    return await this.usersService.updateProfile(updateUserDto,req);
  }
}
