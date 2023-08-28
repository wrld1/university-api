import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Mark } from 'src/marks/entities/mark.entity';
import { Course } from './entities/course.entity';
import { Student } from 'src/students/entities/student.entity';
import { Lector } from 'src/lectors/entities/lector.entity';
import { LectorCourse } from 'src/lector_course/lector_course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mark, Course, Student, Lector, LectorCourse]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
