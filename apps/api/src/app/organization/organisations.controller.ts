import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { CreateOrganisationDto } from '@secure-task-management-system/data';
import { AuthGuard } from '@nestjs/passport';

@Controller('organisations')
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  //Create organisation
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateOrganisationDto, @Request() req: any) {
    const userId = req.user.id; // comes from JWT payload
    return this.organisationsService.createOrganisation(dto, userId);
  }

  //List all organisations for current user
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Request() req: any) {
    const userId = req.user.id;
    return this.organisationsService.findAllByUser(userId);
  }
}
