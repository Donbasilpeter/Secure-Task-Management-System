import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskComment, Task, OrganisationUser, DepartmentUser } from '@secure-task-management-system/data'
import { TaskCommentsService } from './task-comments.service';
import { TaskCommentsController } from './task-comments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TaskComment, Task, OrganisationUser, DepartmentUser])],
  providers: [TaskCommentsService],
  controllers: [TaskCommentsController],
})
export class TaskCommentsModule {}
