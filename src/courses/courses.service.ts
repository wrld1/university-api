import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { Course } from './entities/course.entity';
import { Mark } from '../marks/entities/mark.entity';
import { Lector } from '../lectors/entities/lector.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
    @InjectRepository(Mark)
    private readonly marksRepository: Repository<Mark>,
    @InjectRepository(Lector)
    private readonly lectorsRepository: Repository<Lector>,
  ) {}

  async getAllCourses(): Promise<Course[]> {
    return this.coursesRepository.find({ relations: ['lectors', 'marks'] });
  }

  async getCourseById(courseId: string): Promise<Course> {
    const course = await this.coursesRepository.findOne(courseId, {
      relations: ['lectors', 'marks'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async getMarksForCourse(courseId: string): Promise<any[]> {
    const marks = await this.marksRepository
      .createQueryBuilder('mark')
      .leftJoin('mark.course', 'course')
      .leftJoin('mark.lector', 'lector')
      .leftJoin('mark.student', 'student')
      .where('course.id = :courseId', { courseId })
      .select([
        'course.name as courseName',
        'lector.name as lectorName',
        'student.name as studentName',
        'mark.mark as mark',
      ])
      .getRawMany();

    return marks;
  }

  async getLectorsForCourse(lectorId: string): Promise<Course[]> {
    const lector = await this.lectorsRepository.findOne(lectorId, {
      relations: ['courses'],
    });

    if (!lector) {
      throw new BadRequestException('There is no such lector');
    }

    if (!lector.courses) {
      throw new BadRequestException('The lector does not have any courses');
    }

    return lector.courses;
  }

  async createCourse(courseCreateSchema: Omit<Course, 'id'>): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: {
        name: courseCreateSchema.name,
      },
    });

    if (course) {
      throw new BadRequestException('Course with this name already exists');
    }

    return this.coursesRepository.save(courseCreateSchema);
  }

  async addLectorToCourse(courseId: string, lectorId: string): Promise<Course> {
    const course = await this.coursesRepository.findOne(courseId);
    const lector = await this.lectorsRepository.findOne(lectorId);

    if (!course || !lector) {
      throw new BadRequestException('There is no such id');
    }

    if (!course.lectors) {
      course.lectors = [];
    }

    if (!lector.courses) {
      lector.courses = [];
    }

    course.lectors.push(lector);
    lector.courses.push(course);

    await this.coursesRepository.save(course);
    await this.lectorsRepository.save(lector);

    return course;
  }

  async updateCourseById(
    id: string,
    courseUpdateSchema: Partial<Course>,
  ): Promise<UpdateResult> {
    const result = await this.coursesRepository.update(id, courseUpdateSchema);

    if (!result.affected) {
      throw new NotFoundException('Course with this id is not found');
    }

    return result;
  }

  async deleteCourseById(id: string): Promise<DeleteResult> {
    const result = await this.coursesRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException('Course with this id is not found');
    }

    return result;
  }
}
