import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Mark } from './entities/mark.entity';
import { Student } from '../students/entities/student.entity';
import { Course } from '../courses/entities/course.entity';
import { Lector } from '../lectors/entities/lector.entity';

import { CreateMarkDto } from './dto/create-mark.dto';

@Injectable()
export class MarksService {
  constructor(
    @InjectRepository(Mark)
    private readonly marksRepository: Repository<Mark>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Lector)
    private readonly lectorRepository: Repository<Lector>,
  ) {}

  async getAllMarks(): Promise<Mark[]> {
    const marks = await this.marksRepository.find({
      relations: ['student', 'lector', 'course'],
    });

    return marks;
  }

  async addMark(markCreateSchema: CreateMarkDto): Promise<void> {
    const { mark, course, student, lector } = markCreateSchema;

    const existingCourse = await this.checkEntityExistence(
      this.courseRepository,
      course,
      'Course not found',
    );
    const existingStudent = await this.checkEntityExistence(
      this.studentRepository,
      student,
      'Student not found',
    );
    const existingLector = await this.checkEntityExistence(
      this.lectorRepository,
      lector,
      'Lector not found',
    );

    await this.marksRepository
      .createQueryBuilder()
      .insert()
      .into(Mark)
      .values({
        mark,
        student: existingStudent,
        lector: existingLector,
        course: existingCourse,
      })
      .execute();
  }

  async deleteMark(id: string): Promise<DeleteResult> {
    const mark = await this.marksRepository.delete(id);

    if (!mark.affected) {
      throw new NotFoundException('Mark not found');
    }

    return mark;
  }

  async checkEntityExistence<TEntity>(
    repository: Repository<TEntity>,
    entityId: string,
    errorMessage: string,
  ): Promise<TEntity> {
    const entity = await repository.findOne(entityId as any);

    if (!entity) {
      throw new NotFoundException(errorMessage);
    }

    return entity;
  }
}

// async addMark(markCreateData: CreateMarkDto): Promise<void> {
//   const { mark, course, student, lector } = markCreateData;

//   const [isCourse, isStudent, isLector] = await Promise.all([
//     this.courseRepository.findOne(course),
//     this.studentRepository.findOne(student),
//     this.lectorRepository.findOne(lector),
//   ]);

//   if (!isCourse || !isStudent || !isLector) {
//     const notFoundEntities = [];
//     if (!isCourse) notFoundEntities.push('Course');
//     if (!isStudent) notFoundEntities.push('Student');
//     if (!isLector) notFoundEntities.push('Lector');

//     throw new NotFoundException(`${notFoundEntities.join(', ')} not found`);
//   }

//   await this.markRepository.insert({
//     mark,
//     student: isStudent,
//     lector: isLector,
//     course: isCourse,
//   });
// }
