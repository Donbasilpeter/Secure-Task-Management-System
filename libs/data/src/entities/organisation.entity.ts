// organisation.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrganisationUser } from './organisation-user.entity';
import { Department } from './department.entity';

@Entity('organisations')
export class Organisation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;

  // 🔗 Users in organisation
  @OneToMany(() => OrganisationUser, (ou) => ou.organisation)
  organisationUsers!: OrganisationUser[];

  // 🔗 Departments in organisation ✅
  @OneToMany(() => Department, (dept) => dept.organisation)
  departments!: Department[];
}
