import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { course } from './Model/course.model';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post("CreateCourse")
  async create(@Body() createCourseDto: CreateCourseDto) : Promise<any> {
    return await this.courseService.create(createCourseDto);
  }

  @Get("AllCourses")
  async findAll() : Promise<course[]> {
    return await this.courseService.findAll();
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) : Promise<course> {
  //    await return this.courseService.findOne(+id);
  // }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) :Promise<any> {
    return await this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) :Promise<any> {
    return await this.courseService.remove(id);
  }
}
