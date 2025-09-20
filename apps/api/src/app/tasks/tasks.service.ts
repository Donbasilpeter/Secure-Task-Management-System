// apps/api/src/app/tasks/tasks.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task,CreateTaskDto } from '@secure-task-management-system/data';
import { DepartmentUser, OrganisationUser, User, Department } from '@secure-task-management-system/data';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(Department) private deptRepo: Repository<Department>,
    @InjectRepository(DepartmentUser) private deptUserRepo: Repository<DepartmentUser>,
    @InjectRepository(OrganisationUser) private orgUserRepo: Repository<OrganisationUser>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

async createTask(dto: CreateTaskDto, userId: number): Promise<Task> {
  const department = await this.deptRepo.findOne({
    where: { id: dto.departmentId },
    relations: ['organisation'],
  });
  if (!department) throw new NotFoundException('Department not found');

  // Check permissions
  const orgUser = await this.orgUserRepo.findOne({
    where: { organisation: { id: department.organisation.id }, user: { id: userId } },
  });
  const deptUser = await this.deptUserRepo.findOne({
    where: { department: { id: department.id }, user: { id: userId } },
  });

  const isOwner = orgUser?.role === 'owner';
  const isDeptAdmin = deptUser?.role === 'admin';
  if (!isOwner && !isDeptAdmin) {
    throw new ForbiddenException('Only owner or department admin can create tasks');
  }

  // Always load user entity so we can attach name/email
  const creator = await this.userRepo.findOne({ where: { id: userId } });
  if (!creator) throw new NotFoundException('Creator user not found');

  let assignee: User | null = null;
  if (dto.assignedToId) {
    assignee = await this.userRepo.findOne({ where: { id: dto.assignedToId } });
    if (!assignee) throw new NotFoundException('Assigned user not found');
  } else {
    // Default assign to self
    assignee = creator;
  }

  const task = this.taskRepo.create({
    title: dto.title,
    description: dto.description,
    department,
    createdBy: creator,
    assignedTo: assignee,
  });

  return this.taskRepo.save(task);
}


// apps/api/src/app/tasks/tasks.service.ts
async findTasksByDepartment(deptId: number, userId: number): Promise<Task[]> {
  const department = await this.deptRepo.findOne({ where: { id: deptId } });
  if (!department) throw new NotFoundException('Department not found');

  // Check if user is in this department
  const deptUser = await this.deptUserRepo.findOne({
    where: { department: { id: deptId }, user: { id: userId } },
  });

  if (!deptUser) {
    throw new ForbiddenException('You are not a member of this department');
  }

  return this.taskRepo.find({
    where: { department: { id: deptId } },
    order: { createdAt: 'DESC' },
  });
}

  async deleteTask(taskId: number, userId: number) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ['department', 'department.organisation'],
    });

    if (!task) throw new NotFoundException('Task not found');

    // Check if user is org owner
    const orgUser = await this.orgUserRepo.findOne({
      where: { organisation: { id: task.department.organisation.id }, user: { id: userId } },
    });

    const deptUser = await this.deptUserRepo.findOne({
      where: { department: { id: task.department.id }, user: { id: userId } },
    });

    const isOwner = orgUser?.role === 'owner';
    const isDeptAdmin = deptUser?.role === 'admin';

    if (!isOwner && !isDeptAdmin) {
      throw new ForbiddenException('Only owners or department admins can delete tasks');
    }

    await this.taskRepo.remove(task);
    return { message: 'Task deleted successfully' };
  }
}
