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
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { LectorCourse } from 'src/lector_course/lector_course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
    @InjectRepository(Lector)
    private readonly lectorsRepository: Repository<Lector>,
    @InjectRepository(LectorCourse)
    private readonly lectorCourseRepository: Repository<LectorCourse>,
    @InjectRepository(Mark)
    private readonly marksRepository: Repository<Mark>,
  ) {}

  async getAllCourses(): Promise<Course[]> {
    return await this.coursesRepository.find({
      relations: ['lectors', 'marks'],
    });
  }

  async getCourseById(courseId: string): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: {
        id: courseId,
      },
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

  async getCoursesByLectorId(lectorId: string): Promise<Course[]> {
    const lectorCourses = await this.lectorCourseRepository
      .createQueryBuilder('lector')
      .innerJoinAndSelect('lector.courses', 'courses')
      .where('lector.lectorId = :lectorId', { lectorId })
      .getMany();

    const courses = lectorCourses.flatMap((lc) => lc.courses);

    return courses;
  }

  async createCourse(courseCreateSchema: CreateCourseDto): Promise<Course> {
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
    const course = await this.coursesRepository.findOne({
      where: {
        id: courseId,
      },
    });
    const lector = await this.lectorsRepository.findOne({
      where: {
        id: lectorId,
      },
    });

    if (!course || !lector) {
      throw new BadRequestException('There is no such id');
    }

    await this.lectorCourseRepository
      .createQueryBuilder()
      .insert()
      .into(LectorCourse)
      .values({
        lectorId: lectorId,
        courseId: courseId,
      })
      .execute();

    return course;
  }

  async updateCourseById(
    id: string,
    courseUpdateSchema: UpdateCourseDto,
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
