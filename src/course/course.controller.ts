import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import {  UpdateDtoCourse } from './dto/CourseUpdate.dto';
import { course } from './Model/course.model';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("CreateCourse")
  async createCourse(@Body() createCourseDto: CreateCourseDto,@Request() req:any) : Promise<any> {
    return await this.courseService.createCourse(createCourseDto,req);
  }
  @UseGuards(AuthGuard("jwt"))
  @Get("AllCourses")
  async findAll(@Request() req : any) : Promise<any[]> {
    return await this.courseService.findAll(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(':id')
  async findOne(@Param('id') id: string,@Request() req : any) : Promise<course> {
    return await this.courseService.findOne(id,req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch(':id')
  async Update(@Param('id') id: string,@Body() UpdateDtoCourse : UpdateDtoCourse,@Request() req : any) : Promise<any>{
    return await this.courseService.update(id,UpdateDtoCourse,req);
  }
  @UseGuards(AuthGuard("jwt"))
  @Delete(':id')
  async remove(@Param('id') id: string,@Request() req:any) :Promise<any> {
    return await this.courseService.remove(id,req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/Member/AllCoursesAvailable")
  async AvailableCourses(@Request() req:any) :Promise<course[]>{
    return await this.courseService.AvailableCourses(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("Trainer/MyAssignedCourses")
  async AssignedCourses(@Request() req : any) : Promise<any[]> {
    return await this.courseService.AssignedCourses(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('MyAssignedCourseUpdate/:id')
  async updateAssignedCourse(@Param('id') id: string,@Body() UpdateDtoCourse : UpdateDtoCourse,@Request() req : any) : Promise<any[]> {
    return await this.courseService.updateAssignedCourse(id,UpdateDtoCourse,req);
  }

}
