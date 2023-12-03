import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { QueryFilterDto } from 'src/application/dto/query.filter.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  async getAllStudents(queryFilter: QueryFilterDto): Promise<Student[]> {
    const options = {};
    const { sortField, sortOrder } = queryFilter;

    if (sortField) {
      options['order'] = { [sortField]: sortOrder };
    }

    const students = await this.studentsRepository.find({
      ...options,
    });

    return students;
  }

  async getStudentById(id: string): Promise<Student> {
    const student = await this.studentsRepository
      .createQueryBuilder('student')
      .select([
        'student.id as id',
        'student.name as name',
        'student.surname as surname',
        'student.email as email',
        'student.age as age',
        'student.imagePath as imagePath',
      ])
      .leftJoin('student.group', 'group')
      .addSelect('group.name as groupName')
      .where('student.id = :id', { id })
      .getRawOne();
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  async getStudentMarks(id: string): Promise<Student> {
    const student = await this.studentsRepository.findOne({
      where: {
        id: id,
      },
      relations: ['marks', 'marks.courseId'],
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async createStudent(studentCreateSchema: CreateStudentDto): Promise<Student> {
    const existingStudent = await this.studentsRepository.findOne({
      where: {
        email: studentCreateSchema.email,
      },
    });
    if (existingStudent) {
      throw new BadRequestException('Student with this email already exists');
    }
    return this.studentsRepository.save(studentCreateSchema);
  }

  async updateStudentById(
    id: string,
    studentUpdateRequest: UpdateStudentDto,
  ): Promise<Student | null> {
    const existingStudent = await this.studentsRepository.findOne({
      where: { id: id },
    });

    if (!existingStudent) {
      throw new NotFoundException('Student with this id is not found');
    }

    this.studentsRepository.merge(existingStudent, studentUpdateRequest);

    const updatedStudent = await this.studentsRepository.save(existingStudent);

    return updatedStudent;
  }

  async addGroupToStudent(
    studentId: string,
    groupId: number,
  ): Promise<Student> {
    const student = await this.studentsRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    student.groupId = groupId;
    await this.studentsRepository.save(student);

    return student;
  }

  async addImage(id: string, file: Express.Multer.File): Promise<Student> {
    const student = await this.studentsRepository.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    student.imagePath = file.filename;

    await this.studentsRepository.save(student);
    return student;
  }

  async getImage(id: string): Promise<string | null> {
    const student = await this.studentsRepository.findOne({ where: { id } });

    if (!student || !student.imagePath) {
      throw new NotFoundException('Students image not found');
    }

    return student.imagePath;
  }

  async deleteStudentById(id: string): Promise<DeleteResult> {
    const result = await this.studentsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Student not found');
    }
    return result;
  }
}
