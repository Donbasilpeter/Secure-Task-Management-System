// organisation-user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique  } from 'typeorm';
import { Organisation } from './organisation.entity';
import { User } from './user.entity';

@Entity('organisation_users')
@Unique(['organisation', 'user'])
export class OrganisationUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Organisation, (org) => org.organisationUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organisation_id' })
  organisation!: Organisation;


  @ManyToOne(() => User, (user) => user.organisationUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;


  @Column({ default: 'owner' })
  role!: string;
}
