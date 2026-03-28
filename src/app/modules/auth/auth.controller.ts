import { Controller, Post, Body, Get } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ExcludeAuthGuard } from '@root/src/core/guards/excludeTenant.guard';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @ExcludeAuthGuard()
  async login(@Body() body: LoginDto) {
    return this.authService.validateLogin(body);
  }

  @Post('register')
  @ExcludeAuthGuard()
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Post('setup')
  @ExcludeAuthGuard()
  async setup(@Body() body: CreateUserDto) {
    return this.authService.setupSuperAdmin(body);
  }

  @Get('setup-check')
  @ExcludeAuthGuard()
  async checkSetup() {
    return this.authService.checkSetupNeeded();
  }
}