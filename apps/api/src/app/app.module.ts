import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User,Organisation,OrganisationUser, TaskComment } from '@secure-task-management-system/data';
import { OrganisationsModule } from './organization/organisations.module';
import { DepartmentsModule } from './department/department.module';
import { JwtStrategy } from '@secure-task-management-system/auth'; 
import { UsersModule } from './users/users.module';
import { Department,Task,DepartmentUser } from '@secure-task-management-system/data'
import { TasksModule } from './tasks/tasks.module';
import { TaskCommentsModule } from './task-comments/task-comments.module';
@Module({
  imports: [    
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'appdb',
      entities: [User,Organisation,OrganisationUser,Department,DepartmentUser,Task,TaskComment],
      synchronize: true, 
    }),
    UsersModule,
    OrganisationsModule,
    DepartmentsModule,
    TasksModule,
    TaskCommentsModule
  ],
  controllers: [AppController],
  providers: [AppService,JwtStrategy],
})
export class AppModule {}
