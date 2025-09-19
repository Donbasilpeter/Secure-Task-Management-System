import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User,Organisation,OrganisationUser } from '@secure-task-management-system/data';
import { OrganisationsModule } from './organization/organisations.module';
import { JwtStrategy } from '@secure-task-management-system/auth'; 
import { UsersModule } from './users/users.module';

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
      entities: [User,Organisation,OrganisationUser],
      synchronize: true, 
    }),
    UsersModule,
    OrganisationsModule
  ],
  controllers: [AppController],
  providers: [AppService,JwtStrategy],
})
export class AppModule {}
