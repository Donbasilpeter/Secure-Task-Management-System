import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { User } from './user.entity';
import { TaskComment } from './task-comment.entity';

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

  @OneToMany(() => TaskComment, (comment) => comment.task, { cascade: true })
  comments!: TaskComment[];

  @CreateDateColumn()
  createdAt!: Date;
}
