import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AddGroupToStudentDto } from './dto/add-group-to-student.dto';
import { Student } from './entities/student.entity';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @ApiQuery({
    name: 'name',
    type: 'string',
    required: false,
    description: 'Filter students by name',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the list of students.',
    type: Student,
    isArray: true,
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async getAllStudents(@Query('name') name?: string): Promise<Student[]> {
    return this.studentsService.getAllStudents(name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student by ID' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({
    status: 200,
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found.',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async getStudentById(
    @Param('id', ParseIntPipe) id: string,
  ): Promise<Student> {
    const student = await this.studentsService.getStudentById(id);
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  @Get(':id/marks')
  @ApiParam({ name: 'id', type: 'integer', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Return student marks by ID.',
    type: Student,
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found.',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async getStudentMarks(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Student> {
    const student = await this.studentsService.getStudentMarks(id.toString());
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Student created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  @ApiBody({ type: CreateStudentDto })
  async createStudent(
    @Body() studentCreateRequest: CreateStudentDto,
  ): Promise<Student> {
    return this.studentsService.createStudent(studentCreateRequest);
  }

  @Put(':id')
  @ApiResponse({
    status: 204,
    description: 'Student updated successfully',
    type: Student,
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'Student ID' })
  @ApiBody({ type: UpdateStudentDto })
  async updateStudentById(
    @Param('id', ParseIntPipe) id: string,
    @Body() studentUpdateRequest: UpdateStudentDto,
  ): Promise<Student> {
    const updatedStudent = await this.studentsService.updateStudentById(
      id,
      studentUpdateRequest,
    );
    if (!updatedStudent) {
      throw new NotFoundException('Student not found');
    }
    return updatedStudent;
  }

  @Put(':id/add-group')
  @ApiResponse({
    status: 204,
    description: 'Group added to student successfully',
    type: Student,
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'Student ID' })
  @ApiBody({ type: AddGroupToStudentDto })
  async addGroupToStudent(
    @Param('id') id: string,
    @Body() addGroupRequest: AddGroupToStudentDto,
  ): Promise<Student> {
    const { group } = addGroupRequest;
    const student = await this.studentsService.addGroupToStudent(
      id,
      Number(group),
    );
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  @Put(':id/add-image')
  @ApiResponse({
    status: 204,
    description: 'Image added to student successfully',
    type: Student,
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'Student ID' })
  async addImage(
    @Param('id') id: string,
    @Body('imagePath') imagePath: string,
  ): Promise<Student> {
    const updatedStudent = await this.studentsService.addImage(id, imagePath);
    if (!updatedStudent) {
      throw new NotFoundException('Student not found');
    }
    return updatedStudent;
  }

  @Delete(':id')
  @ApiResponse({
    status: 204,
    description: 'Student deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'Student ID' })
  async deleteStudentById(@Param('id') id: string): Promise<void> {
    const deletedStudent = await this.studentsService.deleteStudentById(id);
    if (!deletedStudent) {
      throw new NotFoundException('Student not found');
    }
  }
}
