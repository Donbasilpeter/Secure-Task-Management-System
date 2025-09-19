// organisation.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { OrganisationUser } from './organisation-user.entity';

@Entity('organisations')
export class Organisation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => OrganisationUser, (ou) => ou.organisation)
  organisationUsers!: OrganisationUser[];
}
