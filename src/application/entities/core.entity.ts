import {
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class CoreEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  public updatedAt: Date;
}
