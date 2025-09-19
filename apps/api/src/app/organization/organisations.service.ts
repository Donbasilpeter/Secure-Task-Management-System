// organisations.service.ts
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
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

    return org;
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
      relations: ['organisation'],
    });

    // Map to just organisation info
    return orgUsers.map((ou) => ({
      id: ou.organisation.id,
      name: ou.organisation.name,
      createdAt: ou.organisation.createdAt,
      role: ou.role,
    }));
  } catch (err) {
    console.error('Failed to fetch organisations:', err);
    throw new InternalServerErrorException('Failed to fetch organisations');
  }
}


}
