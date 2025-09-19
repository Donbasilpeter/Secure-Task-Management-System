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
import { User } from '@secure-task-management-system/data';
import { CreateUserDto } from '@secure-task-management-system/data';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly jwt: JwtService,
  ) { }

  /**
  * Validate user credentials (email + password).
  * - Returns the user if credentials are valid
  * - Throws UnauthorizedException if invalid
  * - Wraps any unexpected error in an InternalServerErrorException
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
   * - Validates credentials
   * - Issues a signed JWT token
   * - Returns token and basic user info
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
   * - Validates DTO fields
   * - Checks for duplicate email
   * - Hashes password before saving
   * - Returns saved user
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
      return await this.repo.save(user);
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
}
