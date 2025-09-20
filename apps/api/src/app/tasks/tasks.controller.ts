// apps/api/src/app/tasks/tasks.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Delete
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from '@secure-task-management-system/data';
import { AuthGuard } from '@nestjs/passport';

// tasks.controller.ts
@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() dto: CreateTaskDto, @Request() req) {
    const userId = req.user.id;
    return this.tasksService.createTask(dto, userId);
  }

  @Get('department/:id')
  async getByDepartment(@Param('id') deptId: number, @Request() req) {
    const userId = req.user.id;
    return this.tasksService.findTasksByDepartment(deptId, userId);
  }
  @Delete(':id')
  async deleteTask(@Param('id') id: number, @Request() req) {
    const userId = req.user.id;
    return this.tasksService.deleteTask(id, userId);
  }
}

