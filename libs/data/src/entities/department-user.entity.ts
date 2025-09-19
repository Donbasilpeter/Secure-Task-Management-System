// department-user.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from './user.entity';
import { Department } from './department.entity';

@Entity('department_users')
export class DepartmentUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Department, (dept) => dept.departmentUsers, { onDelete: 'CASCADE' })
  department!: Department;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user!: User;

  @Column()
  role!: 'owner' | 'admin' | 'viewer';
}
