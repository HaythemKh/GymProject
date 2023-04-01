import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GymService } from 'src/gym/gym.service';
import { Course, CourseDocument } from 'src/Schemas/course.models';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import {  course } from './Model/course.model';

@Injectable()
export class CourseService {

  constructor(
    @InjectModel(Course.name) private CourseModel : Model<CourseDocument>,
    @Inject(GymService) private  gymService : GymService,
    @Inject(UsersService) private  userService : UsersService
  ){}


  async create(createCourseDto: CreateCourseDto) : Promise<any> {
    await this.validationCourseTime(createCourseDto);
    let Course : course = new course(createCourseDto);
    const start = new Date(createCourseDto.StartDate);
    const end = new Date(createCourseDto.EndDate);
    Course.setStartDate(start);
    Course.setEndDate(end);

    const created = await this.CourseModel.create(Course);
    if(!created) throw new NotFoundException("problem with Course creation ");
    await this.gymService.addCourseToList(createCourseDto.Gym,created._id);

     return {"message" : "Course added successfully"};
  }

  async validationCourseTime(data : CreateCourseDto) : Promise<any>
  {
    this.gymService.verifValidId(data.Gym);
    this.userService.verifValidId(data.Trainer);
   if(!(await this.gymService.verifGymExistID(data.Gym))) throw new BadRequestException("This gym doesn't exist ");
   if(!(this.userService.IsTrainerExist(data.Trainer))) throw new BadRequestException("This Trainer doesn't exist ");

   const now = new Date();
   const startDate = new Date(data.StartDate);
   const endDate = new Date(data.EndDate);
   const minStartDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
   const minEndDate = new Date(startDate.getTime() + 48 * 60 * 60 * 1000);

   if(startDate <= minStartDate) throw new BadRequestException("Course start date should be at least 24 hours from now");
   if(endDate < minEndDate) throw new BadRequestException("Course end date should be at least 48 hours after start date");
  }
  verifValidId(id: string){
    const isHexString = /^[0-9a-fA-F]+$/.test(id);
    if(!isHexString || id.length != 24)
     throw new NotFoundException("invalid Equipment ID");
  }
  async findAll() : Promise<course[]> {

    const AllCourses = await this.CourseModel.find().exec();
    let listCourses : course[] = [] ;
    AllCourses.map(CourseJson => {
      listCourses.push(new course(CourseJson));
    });
    return  listCourses;
  }

  // async findOne(id: string) :Promise<course> {
  //   return await `This action returns a #${id} course`;
  // }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    return await `This action updates a #${id} course`;
  }

  async remove(id: string) : Promise<any> {
    return await `This action removes a #${id} course`;
  }
}
