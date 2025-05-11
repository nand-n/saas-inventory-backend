import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ExcludeAuthGuard } from '@root/src/core/guards/excludeTenant.guard';
@ApiTags("Auth")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('login')
  // async login(@Body() loginDto: LoginDto) {
  //   return this.authService.login(loginDto);
  // }

  // @Post('register')
  // async register(@Body() registerDto: CreateUserDto) {
  //   return this.authService.register(registerDto);
  // }

  @Post('login')
@ExcludeAuthGuard()
async login(@Body() body: LoginDto) {
  return  this.authService.validateLogin(body)
}
@Post('register')
@ExcludeAuthGuard()
async register(@Body() body: CreateUserDto) {
  return this.authService.register(body);
}
}