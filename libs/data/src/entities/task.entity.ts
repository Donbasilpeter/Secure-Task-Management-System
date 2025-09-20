// apps/api/src/app/tasks/task.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Department } from '@secure-task-management-system/data';
import { User } from '@secure-task-management-system/data';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @ManyToOne(() => Department, { eager: true })
  department!: Department;

  @ManyToOne(() => User, { eager: true })
  createdBy!: User;

  @ManyToOne(() => User, { eager: true, nullable: true })
  assignedTo!: User;

  @CreateDateColumn()
  createdAt!: Date;
}
