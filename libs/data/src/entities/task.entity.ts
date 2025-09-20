import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { User } from './user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @ManyToOne(() => Department, (dept) => dept.tasks, { onDelete: 'CASCADE' })
  department!: Department;

  @ManyToOne(() => User, (user) => user.createdTasks, { eager: true })
  createdBy!: User;

  @ManyToOne(() => User, (user) => user.assignedTasks, { eager: true, nullable: true })
  assignedTo!: User;

  @CreateDateColumn()
  createdAt!: Date;
}
