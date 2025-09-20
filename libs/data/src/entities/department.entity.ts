import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Organisation } from './organisation.entity';
import { DepartmentUser } from './department-user.entity';
import { Task } from './task.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsNotEmpty()
  name!: string;

  // Belongs to organisation
  @ManyToOne(() => Organisation, (org) => org.departments, { onDelete: 'CASCADE' })
  organisation!: Organisation;

  // Users in department
  @OneToMany(() => DepartmentUser, (du) => du.department, { cascade: true })
  departmentUsers!: DepartmentUser[];

  // Tasks in department
  @OneToMany(() => Task, (task) => task.department, { cascade: true })
  tasks!: Task[];
}
