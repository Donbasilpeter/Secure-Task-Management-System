// apps/api/src/app/tasks/dto/create-task.dto.ts
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  description?: string;

  @IsNotEmpty()
  departmentId!: number;

  @IsOptional()
  assignedToId?: number;
}
