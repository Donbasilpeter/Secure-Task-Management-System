// organisations.service.ts
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
    ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Organisation,
  OrganisationUser,
  CreateOrganisationDto,
} from '@secure-task-management-system/data';

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectRepository(Organisation)
    private readonly orgRepo: Repository<Organisation>,
    @InjectRepository(OrganisationUser)
    private readonly orgUserRepo: Repository<OrganisationUser>,
  ) {}

async createOrganisation(dto: CreateOrganisationDto, userId: number) {
  try {
    // Check if this user already has an org with the same name
    const existing = await this.orgUserRepo
      .createQueryBuilder('ou')
      .innerJoin('ou.organisation', 'org')
      .where('ou.user = :userId', { userId })
      .andWhere('org.name = :name', { name: dto.name })
      .getOne();

    if (existing) {
      throw new ConflictException(
        `You already have an organisation called "${dto.name}"`,
      );
    }

    // Create new organisation
    const org = this.orgRepo.create({ name: dto.name });
    await this.orgRepo.save(org);

    // Link user as owner
    const orgUser = this.orgUserRepo.create({
      organisation: org,
      user: { id: userId } as any, 
      role: 'owner',
    });
    await this.orgUserRepo.save(orgUser);
    
      
    return {...org,role: 'owner'};
  } catch (err) {
    if (err instanceof ConflictException) {
      throw err;
    }
    console.error('Failed to create organisation:', err);
    throw new InternalServerErrorException('Failed to create organisation');
  }
}
async findAllByUser(userId: number) {
  try {
    // Load all organisations linked to this user
    const orgUsers = await this.orgUserRepo.find({
      where: { user: { id: userId } },
      relations:['organisation', 'organisation.departments']
    });

    // Map to just organisation info
    return orgUsers.map((ou) => ({
      id: ou.organisation.id,
      name: ou.organisation.name,
      createdAt: ou.organisation.createdAt,
      role: ou.role,
      departmentsCount: ou.organisation.departments.length
    }));
  } catch (err) {
    console.error('Failed to fetch organisations:', err);
    throw new InternalServerErrorException('Failed to fetch organisations');
  }
}

async findOneByUser(orgId: number, userId: number) {
  const orgUser = await this.orgUserRepo.findOne({
    where: { organisation: { id: orgId }, user: { id: userId } },
    relations: ['organisation','organisation.departments'],
  });

  if (!orgUser) return null;

  // return only the organisation info
  return {
    id: orgUser.organisation.id,
    name: orgUser.organisation.name,
    createdAt: orgUser.organisation.createdAt,
    role: orgUser.role,
    departmentsCount:  orgUser.organisation.departments.length
  };
}

async getOrganisationUsers(orgId: number, actingUserId: number) {
  // 1. Load organisation user record
  const orgUser = await this.orgUserRepo.findOne({
    where: { organisation: { id: orgId }, user: { id: actingUserId } },
    relations: ['organisation', 'user'],
  });

  if (!orgUser) {
    throw new NotFoundException('Organisation not found or access denied');
  }

  // 2. Only owner can list all users
  if (orgUser.role !== 'owner') {
    throw new ForbiddenException('Only the organisation owner can view all users');
  }

  // 3. Load all users in this organisation
  const orgUsers = await this.orgUserRepo.find({
    where: { organisation: { id: orgId } },
    relations: ['user'],
  });

  // 4. Return simplified response
  return orgUsers.map((ou) => ({
    id: ou.user.id,
    name: ou.user.name,
    email: ou.user.email,
    role: ou.role,
  }));
}

async deleteOrganisation(orgId: number, userId: number) {
  // 1. Check if user is the owner
  const orgUser = await this.orgUserRepo.findOne({
    where: { organisation: { id: orgId }, user: { id: userId } },
  });

  if (!orgUser || orgUser.role !== 'owner') {
    throw new ForbiddenException('Only the organisation owner can delete it');
  }

  // 2. Ensure org exists
  const org = await this.orgRepo.findOne({ where: { id: orgId } });
  if (!org) {
    throw new NotFoundException('Organisation not found');
  }

  // 3. Delete org (cascade removes everything else)
  await this.orgRepo.delete(orgId);

  return { message: 'Organisation and all related data deleted successfully' };
}



}
