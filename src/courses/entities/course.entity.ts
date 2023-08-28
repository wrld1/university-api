import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { CoreEntity } from '../../application/entities/core.entity';
import { Lector } from '../../lectors/entities/lector.entity';
import { Mark } from '../../marks/entities/mark.entity';

@Entity({ name: 'courses' })
export class Course extends CoreEntity {
  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'numeric',
    nullable: false,
  })
  hours: number;

  @ManyToMany(() => Lector, (lector) => lector.courses)
  lectors?: Lector[];

  @OneToMany(() => Mark, (mark) => mark.course)
  marks: Mark[];
}
