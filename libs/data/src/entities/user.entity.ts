import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { OrganisationUser } from './organisation-user.entity';
import { DepartmentUser } from './department-user.entity';
import { Task } from './task.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  //Organisation memberships
  @OneToMany(() => OrganisationUser, (ou) => ou.user)
  organisationUsers!: OrganisationUser[];

  // Department memberships
  @OneToMany(() => DepartmentUser, (du) => du.user)
  departmentUsers!: DepartmentUser[];

  // Tasks created by user
  @OneToMany(() => Task, (task) => task.createdBy)
  createdTasks!: Task[];

  //Tasks assigned to user
  @OneToMany(() => Task, (task) => task.assignedTo)
  assignedTasks!: Task[];
}
