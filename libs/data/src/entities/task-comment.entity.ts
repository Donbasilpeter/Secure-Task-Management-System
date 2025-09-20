import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity('task_comments')
export class TaskComment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Task, (task) => task.comments, { onDelete: 'CASCADE' })
  task!: Task;

  @ManyToOne(() => User, (user) => user.taskComments, { eager: true })
  user!: User;

  @Column({ type: 'text' })
  comment!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
