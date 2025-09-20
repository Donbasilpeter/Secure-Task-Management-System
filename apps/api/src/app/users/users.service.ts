import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

// 🔹 Entities from your shared data lib
import {
  User,
  OrganisationUser,
  DepartmentUser,
  Task,
  CreateUserDto,
} from '@secure-task-management-system/data';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,

    @InjectRepository(OrganisationUser)
    private readonly orgUserRepo: Repository<OrganisationUser>,

    @InjectRepository(DepartmentUser)
    private readonly deptUserRepo: Repository<DepartmentUser>,

    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,

    private readonly jwt: JwtService,
  ) {}

  /**
   * Validate user credentials (email + password).
   */
  async validateUser(email: string, password: string) {
    try {
      const user = await this.repo.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Error while validating user credentials',
      );
    }
  }

  /**
   * Login a user with email + password.
   */
  async login(email: string, password: string) {
    try {
      const user = await this.validateUser(email, password);
      const payload = { sub: user.id, email: user.email };
      const token = await this.jwt.signAsync(payload);

      return {
        access_token: token,
        user: { id: user.id, name: user.name, email: user.email },
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new InternalServerErrorException('Login failed');
    }
  }

  /**
   * Register a new user.
   */
  async createUser(dto: CreateUserDto) {
    try {
      if (!dto?.email || !dto?.password || !dto?.name) {
        throw new BadRequestException('Missing required fields');
      }

      const existing = await this.repo.findOne({ where: { email: dto.email } });
      if (existing) {
        throw new ConflictException('User with this email already exists');
      }

      const passwordHash = await bcrypt.hash(dto.password, 10);
      const user = this.repo.create({
        name: dto.name,
        email: dto.email,
        passwordHash,
      });
      const savedUser = await this.repo.save(user);

      delete savedUser.passwordHash; // hide sensitive field
      return savedUser;
    } catch (err) {
      if (
        err instanceof BadRequestException ||
        err instanceof ConflictException
      ) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }
  /**
 * Get accumulated stats for the user.
 */
async getUserStats(userId: number) {
  try {
    // ✅ Count orgs where user is at least viewer
    const orgCount = await this.orgUserRepo.count({
      where: { user: { id: userId } },
    });

    // ✅ Count depts where user is at least viewer
    const deptCount = await this.deptUserRepo.count({
      where: { user: { id: userId } },
    });

    // ✅ Count tasks assigned to the user (all tasks visible)
    const taskCount = await this.taskRepo.count({
      where: { assignedTo: { id: userId } },
    });

    // ✅ Assigned task count only (no full list)
    const assignedTaskCount = await this.taskRepo.count({
      where: { assignedTo: { id: userId } },
    });

    return {
      organisations: orgCount,
      departments: deptCount,
      tasks: taskCount,
      assignedTasks: assignedTaskCount, // 👈 number only
    };
  } catch (err) {
    throw new InternalServerErrorException('Failed to fetch user statistics');
  }
}


}
