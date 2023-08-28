import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CoreEntity } from '../../application/entities/core.entity';
import { Group } from '../../groups/entities/group.entity';
import { Mark } from '../../marks/entities/mark.entity';

@Entity({ name: 'students' })
export class Student extends CoreEntity {
  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  surname: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'numeric',
    nullable: false,
  })
  age: number;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'image_path',
  })
  imagePath: string;

  @Column({
    type: 'integer',
    nullable: true,
    name: 'group_id',
  })
  groupId: number;

  @ManyToOne(() => Group, (group) => group.students, {
    nullable: true,
    eager: false,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @OneToMany(() => Mark, (mark) => mark.student, {
    nullable: false,
  })
  marks: Mark[];
}
