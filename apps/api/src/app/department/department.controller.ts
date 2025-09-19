import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
    Param,
} from '@nestjs/common';
import { DepartmentsService } from './department.service';
import { CreateDepartmentDto } from '@secure-task-management-system/data';
import { AuthGuard } from '@nestjs/passport';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  // Create department
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateDepartmentDto, @Request() req: any) {
    const userId = req.user.id; // comes from JWT payload
    return this.departmentsService.createDepartment(dto, userId);
  }
  
   // Get all departments of an organisation
  @UseGuards(AuthGuard('jwt'))
  @Get('/:orgId')
  findByOrganisation(@Param('orgId') orgId: number, @Request() req: any) {
    const userId = req.user.id;
    return this.departmentsService.getDepartmentsByOrganisation(
      Number(orgId),
      userId,
    );
  }

}
