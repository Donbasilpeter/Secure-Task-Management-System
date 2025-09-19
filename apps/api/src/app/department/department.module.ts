import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '@secure-task-management-system/data'
import { DepartmentUser } from '@secure-task-management-system/data'
import { OrganisationUser } from '@secure-task-management-system/data'
import { DepartmentsService } from './department.service';
import { DepartmentsController } from './department.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Department,
      DepartmentUser,
      OrganisationUser, 
    ]),
  ],
  providers: [DepartmentsService],
  controllers: [DepartmentsController],
  exports: [TypeOrmModule],
})
export class DepartmentsModule {}
