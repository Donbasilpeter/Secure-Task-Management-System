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

@UseGuards(AuthGuard('jwt'))
@Get('/:id/dpt')
async getDepartment(@Param('id') id: number, @Request() req) {
  const userId = req.user.id; // make sure JwtStrategy maps sub -> id
  return this.departmentsService.findByIdForUser(Number(id), userId);
}


  // Add a user to department (only org owner or dept admin can do this)
  @UseGuards(AuthGuard('jwt'))
  @Post('/:deptId/users')
  async addUserToDepartment(
    @Param('deptId') deptId: number,
    @Body() body: { email: string; role: 'admin' | 'viewer' },
    @Request() req: any,
  ) {
    const userId = req.user.id;
    return this.departmentsService.addUserToDepartment(
      Number(deptId),
      body.email,
      body.role,
      userId,
    );
  }
}
