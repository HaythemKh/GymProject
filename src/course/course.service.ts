import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'class-validator';
import { Model } from 'mongoose';
import { GymService } from 'src/gym/gym.service';
import { Course, CourseDocument } from 'src/Schemas/course.models';
import { Registration, RegistrationDocument } from 'src/Schemas/Registration.models';
import { Person, Role, UserDocument } from 'src/Schemas/users.models';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { UpdateDtoCourse } from './dto/CourseUpdate.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import {  course } from './Model/course.model';

@Injectable()
export class CourseService {

  constructor(
    @InjectModel(Course.name) private CourseModel : Model<CourseDocument>,
    @Inject(GymService) private  gymService : GymService,
    @Inject(UsersService) private  userService : UsersService,
    @InjectModel(Person.name) private userModel : Model<UserDocument>,
    @InjectModel(Registration.name) private registrationModel : Model<RegistrationDocument>,
  ){}


  async create(createCourseDto: CreateCourseDto,req : any) : Promise<any> {

    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    // await this.validationCourseTime(createCourseDto);
    createCourseDto.Gym = req.user.gym;
    let Course : course = new course(createCourseDto);
    // const start = new Date(createCourseDto.StartDate);
    // const end = new Date(createCourseDto.EndDate);
    // Course.setStartDate(start);
    // Course.setEndDate(end);

    const created = await this.CourseModel.create(Course);
    if(!created) throw new NotFoundException("problem with Course creation ");
    await this.gymService.addCourseToList(createCourseDto.Gym,created._id);

     return {"message" : "Course added successfully"};
  }

  /*async validationCourseTimeCalendar(data : UpdateCourseDto) : Promise<any>
  {
  //   this.gymService.verifValidId(data.Gym);
  //   this.userService.verifValidId(data.Trainer);
  //  if(!(await this.gymService.verifGymExistID(data.Gym))) throw new BadRequestException("This gym doesn't exist ");
  //  if(!(this.userService.IsTrainerExist(data.Trainer))) throw new BadRequestException("This Trainer doesn't exist ");

   const now = new Date();
   const startDate = new Date(data.StartDate);
   const endDate = new Date(data.EndDate);
   const minStartDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
   const minEndDate = new Date(startDate.getTime() + 48 * 60 * 60 * 1000);

   if(startDate <= minStartDate) throw new BadRequestException("Course start date should be at least 24 hours from now");
   if(endDate < minEndDate) throw new BadRequestException("Course end date should be at least 48 hours after start date");
  }*/
  verifValidId(id: string){
    const isHexString = /^[0-9a-fA-F]+$/.test(id);
    if(!isHexString || id.length != 24)
     throw new NotFoundException("invalid Equipment ID");
  }
  async findAll(req : any) : Promise<course[]> {
    
    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    const AllCourses = await this.CourseModel.find({Gym : req.user.gym});
    const results = [];

      for (const course of AllCourses) {
      const trainer = await this.userModel.findById(course.Trainer);

      if (trainer) {
      const combinedData = {
        ...course.toObject(),
        trainerName: trainer.firstName,
        trainerLastname: trainer.lastName,
      };
      results.push(combinedData);
    }
  }
    return  results;
  }

  async findOne(id: string,req : any) :Promise<course> {
    if(req.user.role !== Role.ADMIN || req.user.role !==Role.MEMBER) throw new UnauthorizedException("You can't can get Access to This !!");
    this.verifValidId(id);
    const currrentCourse = await this.CourseModel.findOne({_id: id,Gym : req.user.gym}).exec();
    if(isEmpty(currrentCourse)) throw new NotFoundException("Course doesn't exist");
    const Course : course = new course(currrentCourse);
    return Course;
  }

  async update(id: string, updateCourseDto: UpdateDtoCourse, req : any) : Promise<any>  {
    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    this.verifValidId(id);
    const foundDocument = await this.CourseModel.findOne({ _id: id,Gym : req.user.gym}).exec();

    if(isEmpty(foundDocument)) throw new NotFoundException("course doesn't exist");
    const Course = new course(updateCourseDto);
    const updatedCourse = await this.CourseModel.findByIdAndUpdate(
      {_id : id},
      {$set: Course},
      {new: true},
    )

    if(!isEmpty(updatedCourse)) return {"message" : "course updated successfully"};
    else throw new NotFoundException("updating course denied");
  }


  async remove(id: string,req : any) : Promise<any> {

    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    this.verifValidId(id);
    const deletedCourse = await this.CourseModel.findByIdAndDelete({_id : id});
    if(deletedCourse){ 
      await this.gymService.RemoveCourseFromList(deletedCourse.Gym,deletedCourse._id);
      return true;
    } 
    else throw new NotFoundException("Course doesn't exist");
  }

  async AvailableCourses(req : any) : Promise<course[]>{

    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    const AllCourses = await this.CourseModel.find({Gym : req.user.gym});
    const results = [];

      for (const course of AllCourses) {
      const trainer = await this.userModel.findById(course.Trainer);
      const VerifyJoinedCourse = await this.registrationModel.findOne({Member : req.user.sub, Course : course._id,IsActive : true});
      
      if (trainer) {
      const combinedData = {
        ...course.toObject(),
        trainerName: trainer.firstName,
        trainerLastname: trainer.lastName,
      };
      if(!VerifyJoinedCourse)
      results.push(combinedData);
    }
  }
    return  results;
  }
}
