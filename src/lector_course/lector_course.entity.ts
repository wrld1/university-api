import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CoreEntity } from '../application/entities/core.entity';
import { Lector } from '../lectors/entities/lector.entity';
import { Course } from '../courses/entities/course.entity';

@Entity({ name: 'lector_course' })
export class LectorCourse extends CoreEntity {
  @PrimaryColumn({ name: 'lector_id' })
  lectorId: string;

  @PrimaryColumn({ name: 'course_id' })
  courseId: string;

  @ManyToOne(() => Lector, (lector) => lector.courses)
  @JoinColumn([{ name: 'lector_id', referencedColumnName: 'id' }])
  lectors: Lector[];

  @ManyToOne(() => Course, (course) => course.lectors)
  @JoinColumn([{ name: 'course_id', referencedColumnName: 'id' }])
  courses: Course[];
}
