import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from '@secure-task-management-system/data';
import { CreateUserDto } from '@secure-task-management-system/data';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /**
 * POST /users/login
 * Authenticate a user with email + password.
 * Returns a JWT token and basic user info if successful.
 */
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.usersService.login(dto.email, dto.password);
  }


  /**
   * POST /users/register
   * Register a new user.
   * Hashes the password and saves the user to the database.
   */
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }
}
