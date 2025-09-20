import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskComment, CreateTaskCommentDto, Task, OrganisationUser, DepartmentUser  } from '@secure-task-management-system/data';

@Injectable()
export class TaskCommentsService {
  constructor(
    @InjectRepository(TaskComment)
    private commentsRepo: Repository<TaskComment>,
    @InjectRepository(Task)
    private tasksRepo: Repository<Task>,
    @InjectRepository(OrganisationUser)
    private orgUserRepo: Repository<OrganisationUser>,
    @InjectRepository(DepartmentUser)
    private deptUserRepo: Repository<DepartmentUser>,
  ) {}

  async addComment(dto: CreateTaskCommentDto, userId: number) {
    const task = await this.tasksRepo.findOne({
      where: { id: dto.taskId },
      relations: ['assignedTo', 'department', 'department.organisation'],
    });
    if (!task) throw new NotFoundException('Task not found');

    //Permission check
    const isAssignee = task.assignedTo?.id === userId;

    const orgUser = await this.orgUserRepo.findOne({
      where: { organisation: { id: task.department.organisation.id }, user: { id: userId } },
    });

    const deptUser = await this.deptUserRepo.findOne({
      where: { department: { id: task.department.id }, user: { id: userId } },
    });

    const isOwner = orgUser?.role === 'owner';
    const isAdmin = deptUser?.role === 'admin';

    if (!isAssignee && !isOwner && !isAdmin) {
      throw new ForbiddenException('Not allowed to add comments to this task');
    }

    const comment = this.commentsRepo.create({
      task,
      user: { id: userId } as any,
      comment: dto.comment,
    });

    return this.commentsRepo.save(comment);
  }

  async getComments(taskId: number) {
    return this.commentsRepo.find({
      where: { task: { id: taskId } },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }
}
