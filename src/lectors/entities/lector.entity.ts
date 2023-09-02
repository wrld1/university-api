import { Column, Entity, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { CoreEntity } from '../../application/entities/core.entity';
import { Course } from '../../courses/entities/course.entity';
import { Mark } from '../../marks/entities/mark.entity';

@Entity({ name: 'lectors' })
export class Lector extends CoreEntity {
  @Column({
    type: 'varchar',
    nullable: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @ManyToMany(() => Course, (course) => course.lectors, {
    nullable: true,
  })
  @JoinTable({
    name: 'lector_course',
    joinColumn: {
      name: 'lector_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'course_id',
      referencedColumnName: 'id',
    },
  })
  courses?: Course[];

  @OneToMany(() => Mark, (mark) => mark.lector)
  marks: Mark[];
}
