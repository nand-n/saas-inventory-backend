import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@root/src/app/modules/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector,
    private jwtService: JwtService,
    private userService: UsersService

  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();

    const isExcluded = this.reflector.get<boolean>('hasExcludedToken', handler);
    if (isExcluded) {
      return true;
    }
    const token = this.extractToken(request.headers.authorization);
    console.log(token , "token");
    if (!token) {
      return false;
    }
    try {
      const decodedToken = await this.jwtService.verifyAsync(token, { secret: 'your_secret_key' });
      const user =await this.userService.findOneByEmail(decodedToken.email);
      console.log(user, "user");
      request.user = user;
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Extracts the token from the Authorization header.
   * @param authorizationHeader The Authorization header string.
   * @returns The extracted token or null if the header is invalid.
   */
  private extractToken(authorizationHeader: string | undefined): string | null {
    if (!authorizationHeader) {
      return null;
    }
    const parts = authorizationHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }

    return null;
  }
}

