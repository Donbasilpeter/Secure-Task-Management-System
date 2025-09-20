// departments.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department, OrganisationUser, DepartmentUser,CreateDepartmentDto, User } from '@secure-task-management-system/data'; // make sure User entity is exported


@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private deptRepo: Repository<Department>,
    @InjectRepository(OrganisationUser)
    private orgUserRepo: Repository<OrganisationUser>,
    @InjectRepository(DepartmentUser)
    private deptUserRepo: Repository<DepartmentUser>,
    @InjectRepository(User) // ✅ Inject user repo
    private userRepo: Repository<User>,
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
// Return shaped response
    return {
      id: dept.id,
      name: dept.name,
      organisationId: dto.organisationId,
      role: 'owner', // creator is always owner
    };
  }
async findByIdForUser(deptId: number, userId: number) {
  const dept = await this.deptRepo.findOne({
    where: { id: deptId },
    relations: ['organisation'], // only what exists on Department
  });

  if (!dept) throw new NotFoundException('Department not found');

  // Get the department-user join for current user
  const deptUser = await this.deptUserRepo.findOne({
    where: { department: { id: deptId }, user: { id: userId } },
    relations: ['user'],
  });

  return {
    id: dept.id,
    name: dept.name,
    organisationId: dept.organisation.id,
    role: deptUser?.role || 'viewer', // fallback
  };
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

async addUserToDepartment(
  deptId: number,
  email: string,
  role: 'admin' | 'viewer',
  actingUserId: number,
) {
  // 1. Load department and its organisation
  const department = await this.deptRepo.findOne({
    where: { id: deptId },
    relations: ['organisation'],
  });
  if (!department) throw new NotFoundException('Department not found');

  // 2. Check if acting user is org owner or dept admin
  const orgUser = await this.orgUserRepo.findOne({
    where: {
      organisation: { id: department.organisation.id },
      user: { id: actingUserId },
    },
  });

  const deptUser = await this.deptUserRepo.findOne({
    where: { department: { id: deptId }, user: { id: actingUserId } },
  });

  const isOwner = orgUser?.role === 'owner';
  const isDeptAdmin = deptUser?.role === 'admin';

  if (!isOwner && !isDeptAdmin) {
    throw new ForbiddenException('Not allowed to add users to this department');
  }

  // 3. Find target user by email
  const targetUser = await this.userRepo.findOne({ where: { email } });
  if (!targetUser) throw new NotFoundException('User not found');

  // 4. Ensure target user is in OrganisationUser (at least as viewer)
  let targetOrgUser = await this.orgUserRepo.findOne({
    where: {
      organisation: { id: department.organisation.id },
      user: { id: targetUser.id },
    },
  });

  if (!targetOrgUser) {
    targetOrgUser = this.orgUserRepo.create({
      organisation: department.organisation,
      user: targetUser,
      role: 'viewer', // ✅ Always at least a viewer at org level
    });
    await this.orgUserRepo.save(targetOrgUser);
  }

  // 5. Check if already in department
  const existingDeptUser = await this.deptUserRepo.findOne({
    where: { department: { id: deptId }, user: { id: targetUser.id } },
  });
  if (existingDeptUser) throw new ConflictException('User already in department');

  // 6. Add them to department
  const newDeptUser = this.deptUserRepo.create({
    department,
    user: targetUser,
    role,
  });
   return { message: 'User added to department successfully' };
}



}
