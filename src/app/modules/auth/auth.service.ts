import { Injectable, UnauthorizedException, ConflictException, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as crypto from 'crypto';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private verifyPassword(
    storedPassword: string,
    enteredPassword: string,
  ): boolean {
    const [salt, storedHash] = storedPassword.split(':');
    const hash = crypto
      .pbkdf2Sync(enteredPassword, salt, 1000, 64, 'sha512')
      .toString('hex');
    return hash === storedHash;
  }

  private hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex');
    return `${salt}:${hash}`;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) return null;
    
    const isPasswordValid = this.verifyPassword(user.password, password);
    return isPasswordValid ? user : null;
  }


  async validateLogin(loginDto: LoginDto): Promise<any> {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { email: 'notFound' },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isValidPassword = this.verifyPassword(user.password, loginDto.password); // Fixed argument order

    if (!isValidPassword) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { password: 'Incorrect Password' },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const { token, refreshToken, tokenExpires } = await this.getTokensData(user); // Pass user here

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
      tenantId: user.tenantId,
      tenant: user.tenant
      
    };
  }

  private async getTokensData(user: User): Promise<{ token: string; refreshToken: string; tokenExpires: Date }> {
    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles,
      tenantId: user.tenantId,
    };

    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 1);

    return { token, refreshToken, tokenExpires };
  }
  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string; user: User }> {
    const user = await this.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { 
      email: user.email, 
      sub: user.id,
      roles: user.roles,
      tenantId: user.tenantId
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user,
      
    };
  }

  

  async register(
    userDto: CreateUserDto,
  ): Promise<{ access_token: string; user: User }> {
    // const existingUser = await this.usersService.findOneByEmail(userDto.email);
    // if (existingUser) {
    //   throw new ConflictException('Email already registered');
    // }

    const hashedPassword = this.hashPassword(userDto.password);
    const createdUser = await this.usersService.create({
      ...userDto,
      password: hashedPassword,
    });

    const payload = {
      email: createdUser.email,
      sub: createdUser.id,
      roles: createdUser.roles,
      tenantId: createdUser.tenantId
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: createdUser,
    };
  }
}