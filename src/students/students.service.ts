import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  async getAllStudents(name?: string): Promise<Student[]> {
    const options: FindManyOptions<Student> = {};

    if (name) {
      options.where = { name: Like(`%${name}%`) };
    }

    const students = await this.studentsRepository.find(options);

    if (!name) {
      return students;
    }

    return students.filter((student) =>
      student.name.toLowerCase().includes(name.toLowerCase()),
    );
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

  async addImage(studentId: string, imagePath: string): Promise<Student> {
    const student = await this.studentsRepository.findOne({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    student.imagePath = imagePath;

    const updatedStudent = await this.studentsRepository.save(student);

    return updatedStudent;
  }

  async deleteStudentById(id: string): Promise<DeleteResult> {
    const result = await this.studentsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Student not found');
    }
    return result;
  }
}
