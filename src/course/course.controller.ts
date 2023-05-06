import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { course } from './Model/course.model';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("CreateCourse")
  async create(@Body() createCourseDto: CreateCourseDto,@Request() req:any) : Promise<any> {
    return await this.courseService.create(createCourseDto,req);
  }
  @UseGuards(AuthGuard("jwt"))
  @Get("AllCourses")
  async findAll(@Request() req : any) : Promise<any[]> {
    return await this.courseService.findAll(req);
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) : Promise<course> {
  //    await return this.courseService.findOne(+id);
  // }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) :Promise<any> {
    return await this.courseService.update(id, updateCourseDto);
  }
  @UseGuards(AuthGuard("jwt"))
  @Delete(':id')
  async remove(@Param('id') id: string,@Request() req:any) :Promise<any> {
    return await this.courseService.remove(id,req);
  }
}
