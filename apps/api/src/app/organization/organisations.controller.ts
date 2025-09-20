import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Param,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { CreateOrganisationDto } from '@secure-task-management-system/data';
import { AuthGuard } from '@nestjs/passport';

@Controller('organisations')
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  // Create organisation
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateOrganisationDto, @Request() req: any) {
    const userId = req.user.id;
    return this.organisationsService.createOrganisation(dto, userId);
  }

  // List all organisations for current user
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Request() req: any) {
    const userId = req.user.id;
    return this.organisationsService.findAllByUser(userId);
  }

  // ✅ Get single organisation by ID (must belong to user)
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number, @Request() req: any) {
    const userId = req.user.id;
    const org = await this.organisationsService.findOneByUser(Number(id), userId);

    if (!org) {
      throw new NotFoundException('Organisation not found or access denied');
    }
    return org;
  }

  // organisations.controller.ts
@UseGuards(AuthGuard('jwt'))
@Get(':id/users')
async getOrganisationUsers(@Param('id') orgId: number, @Request() req: any) {
  const userId = req.user.id;
  return this.organisationsService.getOrganisationUsers(Number(orgId), userId);
}

}
