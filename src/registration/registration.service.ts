import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'class-validator';
import { Model } from 'mongoose';
import { CourseService } from 'src/course/course.service';
import { course } from 'src/course/Model/course.model';
import { EquipmentService } from 'src/equipment/equipment.service';
import { GymService } from 'src/gym/gym.service';
import { reservation } from 'src/reservation/Model/reservation.model';
import { Course, CourseDocument } from 'src/Schemas/course.models';
import { Registration, RegistrationDocument } from 'src/Schemas/Registration.models';
import { Person, Role, UserDocument } from 'src/Schemas/users.models';
import { UsersService } from 'src/users/users.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { registration } from './Model/registration.model';
import { addDays } from 'date-fns';


@Injectable()
export class RegistrationService {

  constructor(
    @InjectModel(Registration.name) private registrationModel : Model<RegistrationDocument>,
    @Inject(CourseService) private  courseService : CourseService,
    @Inject(UsersService) private  usersService : UsersService,
    @Inject(GymService) private  gymService : GymService,
    @InjectModel(Course.name) private CourseModel : Model<CourseDocument>,
    @InjectModel(Person.name) private userModel : Model<UserDocument>, 

  ){}

  async createRegistration(createRegistrationDto: CreateRegistrationDto,req : any) : Promise<any> {

    if(req.user.role !== Role.MEMBER) throw new UnauthorizedException("Member only can get access to this !!");

    this.verifValidIdCourse(createRegistrationDto.Course);
    createRegistrationDto.Member = req.user.sub;

    const verif = await this.registrationModel.findOne({Member : req.user.sub,Course :createRegistrationDto.Course });
    if(verif) throw new BadRequestException("You are already subscribed to this course");
    const Register = new registration(createRegistrationDto);
    const created = await this.registrationModel.create(Register);
    if(!created) throw new BadRequestException("there is a problem in the creation of the registration")
    return "Registration created successfully";
  }

  verifValidIdCourse(id: string){
    const isHexString = /^[0-9a-fA-F]+$/.test(id);
    if(!isHexString || id.length != 24)
     throw new NotFoundException("invalid Course ID");
  }

  verifValidId(id: string){
    const isHexString = /^[0-9a-fA-F]+$/.test(id);
    if(!isHexString || id.length != 24)
     throw new NotFoundException("invalid Registration ID");
  }

  async findAll(req : any) : Promise<any[]> {

    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    const UserList = await this.gymService.getUserListByGym(req.user.gym);

    const AllRegistration = await this.registrationModel.find({Member : {$in : UserList}}).exec();
    const results = [];

      for (const registration of AllRegistration) {
      const Member = await this.userModel.findById(registration.Member);
      const course = await this.CourseModel.findById(registration.Course);
      const expirationDate = this.getExpirationDate(registration.createdAt,registration.Duration);

      if (Member && course) {
      const combinedData = {
        ...registration.toObject(),
        MemberName: Member.firstName,
        MemberLastname: Member.lastName,
        CourseName : course.Name,
        ExpireDate : expirationDate
      };
      results.push(combinedData);
    }
    }
    return results;
  }

  async findOne(id: string, req : any) : Promise<registration> {

    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    this.verifValidId(id);
    const RegistrationModel = await this.registrationModel.findOne({_id : id}).exec();
    if(isEmpty(RegistrationModel)) throw new NotFoundException("Registration doesn't exist");
    const Registration : registration = new registration(RegistrationModel);
    return  Registration;
  }

  async update(id: string, updateRegistrationDto: UpdateRegistrationDto,req : any) : Promise<any> {
    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    this.verifValidId(id);
    const foundDocument = await this.registrationModel.findOne({ _id: id}).exec();

    if(isEmpty(foundDocument)) throw new NotFoundException("registration doesn't exist");
    const Registration = new registration(updateRegistrationDto);
    const updatedRegistration = await this.registrationModel.findByIdAndUpdate(
      {_id : foundDocument._id},
      {$set: Registration},
      {new: true},
    )

    if(!isEmpty(updatedRegistration)) return {"message" : "registration updated successfully"};
    else throw new NotFoundException("updating registration denied");
  }


  async remove(id: string,req : any) : Promise<any> {
    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    this.verifValidId(id);
    const deletedRegistration = await this.registrationModel.findByIdAndDelete({_id : id});
    if(deletedRegistration)
    {
      return {"message" : "Registration deleted successfully"};
    } 
    else throw new NotFoundException("Registration doesn't exist");
  }

  getExpirationDate(createdDate : Date, Duration : number): Date {
    const expirationDate = addDays(createdDate, Duration);
    return expirationDate;
  }

  async MyRegistrations(req : any) : Promise<registration[]>{

    if(req.user.role !== Role.MEMBER) throw new UnauthorizedException("Only Members can get Access to This !!");

    const CourseList = await this.gymService.getCourseListByGym(req.user.gym);

    const AllRegistration = await this.registrationModel.find({Member : req.user.sub,Course :{$in : CourseList}}).exec();
    const results = [];

      for (const registration of AllRegistration) {
      const Member = await this.userModel.findById(registration.Member);
      const course = await this.CourseModel.findById(registration.Course);
      const expirationDate = this.getExpirationDate(registration.createdAt,registration.Duration);
      if (Member && course) {
      const combinedData = {
        ...registration.toObject(),
        MemberName: Member.firstName,
        MemberLastname: Member.lastName,
        CourseName : course.Name,
        StartTime : course.StartDate,
        EndTime : course.EndDate,
        daysOfWeek : course.daysOfWeek,
        ExpireDate : expirationDate
      };
      results.push(combinedData);
    }
    }
    return results;
  }
}
