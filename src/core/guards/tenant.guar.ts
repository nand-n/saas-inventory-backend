import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();

    const isExcluded = this.reflector.get<boolean>(
      'hasExcludedTenantId',
      handler,
    );
    if (isExcluded) {
      return true;
    }
    const tenantId = request.headers.tenantid;

    if (!tenantId) {
      throw new BadRequestException('tenantId In header is missing');
    }
    request.tenantId = tenantId;
    return true;
  }
}



// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { TenantsService } from '@root/src/app/modules/tenants/tenants.service';
// import { Request } from 'express';

// @Injectable()
// export class TenantGuard implements CanActivate {
//   constructor(private tenantsService: TenantsService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest<Request>();
//     const user = request.user;

//     if (!user?.tenantId) return false;

//     // Verify tenant is active
//     const tenant = await this.tenantsService.findOne(user.tenantId);
//     if (!tenant.isActive) throw new Error('Tenant account is suspended');

//     // Attach tenant to request for downstream use
//     request.tenant = tenant;
    
//     return true;
//   }
// }