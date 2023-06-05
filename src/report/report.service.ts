import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GymService } from 'src/gym/gym.service';
import { Report, ReportDocument } from 'src/Schemas/report.models';
import { Person, Role, UserDocument } from 'src/Schemas/users.models';
import { UsersService } from 'src/users/users.service';
import { CreateReportDto } from './dto/create-report.dto';
import { report } from './Model/report.model';
@Injectable()
export class ReportService {

  constructor(
    @InjectModel(Report.name) private reportModel : Model<ReportDocument>,
    @Inject(GymService) private  gymService : GymService,
    @Inject(UsersService) private  usersService : UsersService,
    @InjectModel(Person.name) private userModel : Model<UserDocument>, 
  ){}

  async create(createReportDto: CreateReportDto, req : any) : Promise<any> {

    if(req.user.role=== Role.ADMIN) throw new UnauthorizedException("Only Members can get Access to This !!");

    const now = new Date();now.setHours(now.getHours() + 1);
    createReportDto.DateTime = now;
    createReportDto.UserID = req.user.sub;
    const myreport = new report(createReportDto);

    const currrentUser = await this.userModel.findOne({_id: myreport.UserID}).exec();
    if(!currrentUser) throw new NotFoundException("user doesn't exist");

    const created = await this.reportModel.create(myreport);
    if(!created) throw new NotFoundException("problem with Report creation ");
     return {"message" : "Report send successfully"};
  }

  async findAll(req : any) : Promise<any[]> {
    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    const UserList = await this.gymService.getUserListByGym(req.user.gym);
    const AllReports = await this.reportModel.find({UserID : {$in : UserList}});
    const results = [];
    for (const report of AllReports) {
      const Member = await this.userModel.findById(report.UserID);

      if (Member) {
        const combinedData = {
          ...report.toObject(),
          MemberName: Member.firstName,
          MemberLastName: Member.lastName,
        };
      results.push(combinedData);
    }
  }
    return  results;
  }

  verifValidId(id: string){
    const isHexString = /^[0-9a-fA-F]+$/.test(id);
    if(!isHexString || id.length != 24)
     throw new NotFoundException("invalid Report ID");
  }
  async findOne(id: string,req : any) : Promise<any> {
    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");
    this.verifValidId(id);
    const ReportModel = await this.reportModel.findOne({_id : id}).exec();
    if(!ReportModel) throw new NotFoundException("Report doesn't exist");
    const Report : report = new report(ReportModel);
    return  Report;
  }

  async remove(id: string,req : any) : Promise<any> {

    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    this.verifValidId(id);
    const deletedReport = await this.reportModel.findByIdAndDelete({_id : id});
    if(deletedReport)
    {
      return {"message" : "Report deleted successfully"};
    } 
    else throw new NotFoundException("Report doesn't exist");
  }
}
