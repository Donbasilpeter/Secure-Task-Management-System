import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TaskCommentsService } from './task-comments.service';
import { CreateTaskCommentDto } from '@secure-task-management-system/data'
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks/:taskId/comments')
@UseGuards(AuthGuard('jwt'))
export class TaskCommentsController {
  constructor(private readonly commentsService: TaskCommentsService) {}

  @Post()
  async addComment(
    @Param('taskId') taskId: number,
    @Body() dto: CreateTaskCommentDto,
    @Request() req,
  ) {
    return this.commentsService.addComment({ ...dto, taskId }, req.user.id);
  }

  @Get()
  async getComments(@Param('taskId') taskId: number) {
    return this.commentsService.getComments(taskId);
  }
}
