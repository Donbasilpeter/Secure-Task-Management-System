// apps/api/src/app/tasks/tasks.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '@secure-task-management-system/data';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Department, DepartmentUser, OrganisationUser, User } from '@secure-task-management-system/data';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Department, DepartmentUser, OrganisationUser, User])],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
