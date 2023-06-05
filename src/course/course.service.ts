import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'class-validator';
import { Model } from 'mongoose';
import { GymConfigService } from 'src/gym-config/gym-config.service';
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
    @Inject(GymConfigService) private  gymConfigService : GymConfigService,
  ){}


  async create(createCourseDto: CreateCourseDto,req : any) : Promise<any> {

    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    await this.validationCourseCreation(createCourseDto,req);
    createCourseDto.Gym = req.user.gym;

    let StartTime = new Date(Date.parse(`01/01/2000 ${createCourseDto.StartDate}`));
    let EndTime =  new Date(Date.parse(`01/01/2000 ${createCourseDto.EndDate}`));
    createCourseDto.StartDate = StartTime;
    createCourseDto.EndDate = EndTime;

    let Course : course = new course(createCourseDto);

    const created = await this.CourseModel.create(Course);
    if(!created) throw new NotFoundException("problem with Course creation ");
    await this.gymService.addCourseToList(createCourseDto.Gym,created._id);

     return {"message" : "Course added successfully"};
  }

  async validationCourseCreation(data : CreateCourseDto,req: any) : Promise<any>
  {
    const verifCourseExist = await this.CourseModel.findOne({Name : data.Name});
    if(verifCourseExist) throw new BadRequestException("Course Exist");
    this.verifValidIdTrainer(data.Trainer);
   if(!(await this.gymService.verifGymExistID(req.user.gym))) throw new BadRequestException("This gym doesn't exist ");
   if(!(this.userService.IsTrainerExist(data.Trainer))) throw new BadRequestException("This Trainer doesn't exist ");

    const gymconfig = await this.gymConfigService.findOneGym(req.user.gym);
    const convertorOpening : string = `${gymconfig.OpeningTime}`;
    const convertorClosing : string = `${gymconfig.ClosingTime}`;
    const [h1, m1] = convertorOpening.split(':');
    const [h2, m2] = convertorClosing.split(':');
    const hourOpen = Number(h1);
    const minuteOpen = Number(m1);
    const hourClose = Number(h2);
    const minuteClose = Number(m2);

   const now = new Date();
   now.setHours(now.getHours() + 1);


   let StartTime = new Date(new Date().toDateString() + " " + data.StartDate);
   StartTime.setHours(StartTime.getHours() + 1);
  
   let endTime = new Date(new Date().toDateString() + " " + data.EndDate);
   endTime.setHours(endTime.getHours() + 1);

   
   if(endTime <= StartTime) throw new BadRequestException("Course end date should be at greater than the start date");

   const startHour = StartTime.getUTCHours();
   const startMinutes = StartTime.getUTCMinutes();
   const EndHour = endTime.getUTCHours();
   const EndMinutes = endTime.getUTCMinutes();

    if (
      startHour < hourOpen ||
      (startHour === hourOpen && startMinutes < minuteOpen) ||
      EndHour > hourClose ||
      (EndHour === hourClose && EndMinutes > minuteClose)
      ) 
  throw new BadRequestException(`This gym is closed at this time. It opens at ${gymconfig.OpeningTime} and closes at ${gymconfig.ClosingTime}`);

  }

  async validationCourseUpdateTimes(data : UpdateDtoCourse,req: any,verifCourse : course) : Promise<any>
  {
    const gymconfig = await this.gymConfigService.findOneGym(req.user.gym);
    const convertorOpening : string = `${gymconfig.OpeningTime}`;
    const convertorClosing : string = `${gymconfig.ClosingTime}`;
    const [h1, m1] = convertorOpening.split(':');
    const [h2, m2] = convertorClosing.split(':');
    const hourOpen = Number(h1);
    const minuteOpen = Number(m1);
    const hourClose = Number(h2);
    const minuteClose = Number(m2);

    const convertorPreviousStart : string = `${verifCourse.StartDate}`;
    const convertorPreviousEnd : string = `${verifCourse.EndDate}`;
    const [PreviousHourStart, PreviousMinutesStart] = convertorPreviousStart.split(':');
    const [PreviousHourEnd, PreviousMinutesEnd] = convertorPreviousEnd.split(':');

    const StarthourPrevious = Number(PreviousHourStart);
    const StartMinutesPrevious = Number(PreviousMinutesStart);
    const EndhourPrevious = Number(PreviousHourEnd);
    const EndMinutesPrevious = Number(PreviousMinutesEnd);

    if(data.StartDate !== undefined && data.EndDate === undefined)
    {
      data.StartDate = new Date(Date.parse(`01/01/2000 ${data.StartDate}`));
      if(data.StartDate.getUTCHours() > EndhourPrevious ||
       (data.StartDate.getUTCHours() === EndhourPrevious && data.StartDate.getUTCMinutes() >= EndMinutesPrevious )
       )
       throw new BadRequestException(`Start time should be less than the end time ${verifCourse.EndDate}`);

       if(data.StartDate.getUTCHours() < hourOpen || 
       (data.StartDate.getUTCHours() === hourOpen && data.StartDate.getUTCMinutes() < minuteOpen )
       )
       throw new BadRequestException(`Choose Start time after this time ${gymconfig.OpeningTime} because it's closed now`);
    }
    if(data.EndDate !== undefined && data.StartDate === undefined)
    {
      data.EndDate = new Date(Date.parse(`01/01/2000 ${data.EndDate}`));

      if(data.EndDate.getUTCHours() < StarthourPrevious ||
       (data.EndDate.getUTCHours() === StarthourPrevious && data.EndDate.getUTCMinutes() <= StartMinutesPrevious )
       )
       throw new BadRequestException(`End time should be greater than the Start time ${verifCourse.StartDate}`);

       if(data.EndDate.getUTCHours() > hourClose || 
       (data.EndDate.getUTCHours() === hourClose && data.EndDate.getUTCMinutes() >  minuteClose)
       )
       throw new BadRequestException(`Choose Endtime before this time ${gymconfig.ClosingTime} because it's closed now`);
    }
    if(data.EndDate !== undefined && data.StartDate !== undefined)
    {
      data.StartDate = new Date(Date.parse(`01/01/2000 ${data.StartDate}`));
      data.EndDate = new Date(Date.parse(`01/01/2000 ${data.EndDate}`));
      
      if(data.EndDate <= data.StartDate) throw new BadRequestException("Course end time should be at greater than the start time");

      if (
        data.StartDate.getUTCHours() < hourOpen ||
        (data.StartDate.getUTCHours() === hourOpen && data.StartDate.getUTCMinutes() < minuteOpen) ||
        data.EndDate.getUTCHours() > hourClose ||
        (data.EndDate.getUTCHours() === hourClose && data.EndDate.getUTCMinutes() > minuteClose)
        )
        throw new BadRequestException(`This gym is closed at this time. It opens at ${gymconfig.OpeningTime} and closes at ${gymconfig.ClosingTime}`);
    }

  }

  // async validationCourseTimeCalendar(data : UpdateCourseDto) : Promise<any>
  // {
  // //   this.gymService.verifValidId(data.Gym);
  // //   this.userService.verifValidId(data.Trainer);
  // //  if(!(await this.gymService.verifGymExistID(data.Gym))) throw new BadRequestException("This gym doesn't exist ");
  // //  if(!(this.userService.IsTrainerExist(data.Trainer))) throw new BadRequestException("This Trainer doesn't exist ");

  //  const now = new Date();
  //  const startDate = new Date(data.StartDate);
  //  const endDate = new Date(data.EndDate);
  //  const minStartDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  //  const minEndDate = new Date(startDate.getTime() + 48 * 60 * 60 * 1000);

  //  if(startDate <= minStartDate) throw new BadRequestException("Course start date should be at least 24 hours from now");
  //  if(endDate < minEndDate) throw new BadRequestException("Course end date should be at least 48 hours after start date");
  // }

  verifValidGymId(id: string){
    const isHexString = /^[0-9a-fA-F]+$/.test(id);
    if(!isHexString || id.length != 24)
     throw new NotFoundException("invalid Gym ID");
  }

  verifValidIdTrainer(id: string){
    const isHexString = /^[0-9a-fA-F]+$/.test(id);
    if(!isHexString || id.length != 24)
     throw new NotFoundException("invalid Trainer ID");
  }

  verifValidId(id: string){
    const isHexString = /^[0-9a-fA-F]+$/.test(id);
    if(!isHexString || id.length != 24)
     throw new NotFoundException("invalid Equipment ID");
  }

  async findAll(req : any) : Promise<course[]> {
    
    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    const AllCourses = await this.CourseModel.find({Gym : req.user.gym});
    const results = [];

      for (const Course of AllCourses) {
      const trainer = await this.userModel.findById(Course.Trainer);

      const newCourse = new course(Course);
      const combinedData = {
        ...newCourse,
        trainerName: trainer.firstName,
        trainerLastname: trainer.lastName,
      };
      results.push(combinedData);
    }
    return  results;
  }
  
  async findOne(id: string,req : any) :Promise<course> {
    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("You can't can get Access to This !!");
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
    const verifCourse = new course(foundDocument);
    await this.validationCourseUpdateTimes(updateCourseDto,req,verifCourse);

    const Course = new course(updateCourseDto);
    const updatedCourse = await this.CourseModel.findByIdAndUpdate(
      {_id : foundDocument._id},
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

    if(req.user.role !== Role.MEMBER) throw new UnauthorizedException("Only Members can get Access to This !!");

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

  async AssignedCourses(req : any) : Promise<any[]>{
    const mycourses = await this.CourseModel.find({Trainer : req.user.sub});
    let listCourses : course[] = [] ;
    mycourses.map(courseJson => {
      listCourses.push(new course(courseJson));
    });
     return listCourses;
  }

  async updateAssignedCourse(id: string, updateCourseDto: UpdateDtoCourse, req : any) : Promise<any>  {
    if(req.user.role !== Role.TRAINER) throw new UnauthorizedException("Only Trainer can get Access to This !!");

    this.verifValidId(id);
    const foundDocument = await this.CourseModel.findOne({ _id: id,Gym : req.user.gym}).exec();

    if(isEmpty(foundDocument)) throw new NotFoundException("course doesn't exist");
    const verifCourse = new course(foundDocument);
    await this.validationCourseUpdateTimes(updateCourseDto,req,verifCourse);

    const Course = new course(updateCourseDto);
    const updatedCourse = await this.CourseModel.findByIdAndUpdate(
      {_id : foundDocument._id},
      {$set: Course},
      {new: true},
    )
    if(!isEmpty(updatedCourse)) return {"message" : "Assigned course updated successfully"};
    else throw new NotFoundException("updating assigned course denied");
  }
}
