import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../application/entities/core.entity';
import { Student } from '../../students/entities/student.entity';
import { Lector } from '../../lectors/entities/lector.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity({ name: 'marks' })
export class Mark extends CoreEntity {
  @Column({
    type: 'numeric',
    nullable: false,
  })
  mark: number;

  @ManyToOne(() => Student, (student) => student.marks)
  student: Student;

  @ManyToOne(() => Lector, (lector) => lector.marks)
  lector: Lector;

  @ManyToOne(() => Course, (course) => course.marks)
  course: Course;
}
