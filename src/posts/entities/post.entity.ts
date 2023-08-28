import { Column, Entity } from 'typeorm';
import { CoreEntity } from '../../application/entities/core.entity';

@Entity({ name: 'posts' })
export class Post extends CoreEntity {
  @Column({
    type: 'varchar',
    nullable: false,
  })
  title: string;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  description: string;
}
