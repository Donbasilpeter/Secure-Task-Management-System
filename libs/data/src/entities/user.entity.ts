import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { OrganisationUser } from './organisation-user.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number; // int, auto-increment

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  // 🔗 Relation to organisation_users
  @OneToMany(() => OrganisationUser, (ou) => ou.user)
  organisationUsers!: OrganisationUser[];
}
