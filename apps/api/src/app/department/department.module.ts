import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department, OrganisationUser, DepartmentUser, User } from '@secure-task-management-system/data';

import { DepartmentsService } from './department.service';
import { DepartmentsController } from './department.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Department,
      DepartmentUser,
      OrganisationUser, 
       User,
    ]),
  ],
  providers: [DepartmentsService],
  controllers: [DepartmentsController],
  exports: [TypeOrmModule],
})
export class DepartmentsModule {}
