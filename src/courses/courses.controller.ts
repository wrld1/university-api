import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Return the list of courses.',
    type: Course,
    isArray: true,
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async getAllCourses(): Promise<Course[]> {
    return this.coursesService.getAllCourses();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found.',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async getCourseById(@Param('id') courseId: string): Promise<Course> {
    const course = await this.coursesService.getCourseById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  @Get(':id/marks')
  @ApiResponse({
    status: 200,
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found.',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async getMarksForCourse(@Param('id') courseId: string): Promise<any[]> {
    return this.coursesService.getMarksForCourse(courseId);
  }

  @Get('lectors/:lectorId')
  @ApiResponse({
    status: 200,
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found.',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async getCoursesByLectorId(
    @Param('lectorId') lectorId: string,
  ): Promise<Course[]> {
    return this.coursesService.getCoursesByLectorId(lectorId);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Course created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<Course> {
    return this.coursesService.createCourse(createCourseDto);
  }

  @Patch(':courseId/add-lector/:lectorId')
  @ApiResponse({
    status: 204,
    description: 'Course patched.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async addLectorToCourse(
    @Param('courseId') courseId: string,
    @Param('lectorId') lectorId: string,
  ): Promise<Course> {
    return this.coursesService.addLectorToCourse(courseId, lectorId);
  }

  @Patch(':id')
  @ApiResponse({
    status: 204,
    description: 'Course patched.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async updateCourseById(
    @Param('id', ParseIntPipe) courseId: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    const updatedCourse = await this.coursesService.updateCourseById(
      courseId,
      updateCourseDto,
    );
    if (!updatedCourse) {
      throw new NotFoundException('Course not found');
    }
    return await this.coursesService.getCourseById(courseId);
  }

  @Delete(':id')
  @ApiResponse({
    status: 204,
    description: 'Course deleted.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async deleteCourseById(@Param('id') courseId: string): Promise<void> {
    const deleteResult = await this.coursesService.deleteCourseById(courseId);
    if (deleteResult.affected === 0) {
      throw new NotFoundException('Course not found');
    }
  }
}
