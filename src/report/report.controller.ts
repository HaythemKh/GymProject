import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("createMemberReport")
  async create(@Body() createReportDto: CreateReportDto,@Request() req : any) : Promise<any> {
    return await this.reportService.create(createReportDto,req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("AllReports")
  async findAll(@Request() req : any) : Promise<any[]> {
    return await this.reportService.findAll(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(':id')
  async findOne(@Param('id') id: string,@Request() req : any) : Promise<any> {
    return await this.reportService.findOne(id,req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(':id')
  async remove(@Param('id') id: string,@Request() req : any) : Promise<any> {
    return this.reportService.remove(id,req);
  }
}
