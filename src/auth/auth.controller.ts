import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUserAuthenticated } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { RoleProtected } from './decorators/role-protected.decorator';
import { UserRoleGuard } from './guards/user-role.guard';
import { Auth } from './decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth - modulo de autentificación de la API')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUserAuthenticated() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  // Usa decorador role-protected y el user-role
  @Get('private1')
  @RoleProtected(ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute1(
    @GetUserAuthenticated('id') user: User,
    @RawHeaders() rawHeaders: string[],
  ) {
    return { user, rawHeaders };
  }

  // Usa el decorador @auth
  @Get('private2')
  @Auth(ValidRoles.user)
  privateRoute2(@GetUserAuthenticated() user: User) {
    return {
      ok: true,
      user,
    };
  }
}
