// organisations.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organisation } from '@secure-task-management-system/data';
import { OrganisationUser } from '@secure-task-management-system/data';
import { OrganisationsService } from './organisations.service';
import { OrganisationsController } from './organisations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Organisation, OrganisationUser])],
  providers: [OrganisationsService],
  controllers: [OrganisationsController],
  exports: [TypeOrmModule], // so other modules can use it
})
export class OrganisationsModule {}
