// departments.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '@secure-task-management-system/data';
import { OrganisationUser } from '@secure-task-management-system/data';
import { DepartmentUser } from '@secure-task-management-system/data';
import { CreateDepartmentDto } from '@secure-task-management-system/data';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private deptRepo: Repository<Department>,
    @InjectRepository(OrganisationUser)
    private orgUserRepo: Repository<OrganisationUser>,
    @InjectRepository(DepartmentUser)
    private deptUserRepo: Repository<DepartmentUser>,
  ) {}

  async createDepartment(dto: CreateDepartmentDto, userId: number) {
    // Check if user is owner of organisation
    const orgUser = await this.orgUserRepo.findOne({
      where: { organisation: { id: dto.organisationId }, user: { id: userId } },
    });

    if (!orgUser) {
      throw new NotFoundException('User is not part of this organisation');
    }
    if (orgUser.role !== 'owner') {
      throw new ForbiddenException('Only owners can create departments');
    }

  //  2. Check if department with same name exists in organisation
  const existing = await this.deptRepo.findOne({
    where: {
      name: dto.name,
      organisation: { id: dto.organisationId },
    },
  });

  if (existing) {
    throw new ConflictException(
      `Department "${dto.name}" already exists in this organisation`,
    );
  }

    // Create department
    const dept = this.deptRepo.create({
      name: dto.name,
      organisation: { id: dto.organisationId },
    });
    await this.deptRepo.save(dept);

    // Add creator as Department Owner
    const deptUser = this.deptUserRepo.create({
      department: dept,
      user: { id: userId },
      role: 'owner',
    });
    await this.deptUserRepo.save(deptUser);

    return dept;
  }

async getDepartmentsByOrganisation(orgId: number, userId: number) {
  // 1. Check if user is part of organisation
  const orgUser = await this.orgUserRepo.findOne({
    where: { organisation: { id: orgId }, user: { id: userId } },
  });

  if (!orgUser) {
    throw new ForbiddenException(
      'You are not a member of this organisation',
    );
  }

  // 2. Get all departments under this organisation with departmentUsers
  const departments = await this.deptRepo.find({
    where: { organisation: { id: orgId } },
    relations: ['departmentUsers', 'departmentUsers.user'],
    order: { name : 'ASC' },
  });

  // 3. Map to simplified response
  return departments.map((dept) => {
    // Find current user's role in this department
    const membership = dept.departmentUsers.find(
      (du) => du.user.id === userId,
    );

    return {
      id: dept.id,
      name: dept.name,
      organisationId: orgId,  //include organisationId
      role: membership ? membership.role : 'viewer', // default to viewer if no explicit role
    };
  });
}


}
