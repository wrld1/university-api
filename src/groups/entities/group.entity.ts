import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from '../../application/entities/core.entity';
import { Student } from '../../students/entities/student.entity';

@Entity({ name: 'groups' })
export class Group extends CoreEntity {
  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @OneToMany(() => Student, (student) => student.group)
  students: Student[];
}
