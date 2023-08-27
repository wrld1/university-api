import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { getConnection } from 'typeorm';
import { Mark } from './entities/mark.entity';
import { Student } from '../students/entities/student.entity';
import { Course } from '../courses/entities/course.entity';
// import { Lector } from '../lectors/entities/lector.entity';

import { CreateMarkDto } from './dto/create-mark.dto';

@Injectable()
export class MarksService {
  constructor(
    @InjectRepository(Mark)
    private readonly marksRepository: Repository<Mark>,
  ) {}

  async getAllMarks(): Promise<Mark[]> {
    const marks = await this.marksRepository.find({
      relations: ['student', 'lector', 'course'],
    });

    return marks;
  }

  async addMark(markCreateSchema: CreateMarkDto): Promise<void> {
    const { mark, courseId, studentId, lectorId } = markCreateSchema;

    const course = await this.checkEntityExistence(
      Course,
      courseId,
      'Course not found',
    );
    const student = await this.checkEntityExistence(
      Student,
      studentId,
      'Student not found',
    );
    const lector = await this.checkEntityExistence(
      Lector,
      lectorId,
      'Lector not found',
    );

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Mark)
      .values({
        mark,
        student,
        lector,
        course,
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

  private async checkEntityExistence<TEntity>(
    entityClass: TEntity,
    entityId: string,
    errorMessage: string,
  ): Promise<TEntity> {
    const entity = await this.marksRepository.findOne(entityId);

    if (!entity) {
      throw new NotFoundException(errorMessage);
    }

    return entity;
  }
}
