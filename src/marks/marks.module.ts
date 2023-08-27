import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarksService } from './marks.service';
import { MarksController } from './marks.controller';
import { Mark } from './entities/mark.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Student } from 'src/students/entities/student.entity';
import { Lector } from 'src/lectors/entities/lector.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mark, Course, Student, Lector])],
  controllers: [MarksController],
  providers: [MarksService],
})
export class MarksModule {}
