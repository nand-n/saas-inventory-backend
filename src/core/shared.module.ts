import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerService } from './middlewares/logger.middleware';
import { MorganMiddleware } from './middlewares/morgan.middleware';
import { ConfigModule } from '@nestjs/config';
import { TenantGuard } from './guards/tenant.guar';
import { RolesGuard } from './guards/roles.guard';
import { IndustryTypeModule } from '../app/modules/industryType/industry-type.module';
import { UsersModule } from '../app/modules/users/users.module';
import { TenantsModule } from '../app/modules/tenants/tenants.module';
import { JwtStrategy } from '../app/modules/auth/strategy/jwt.strategy';

@Module({
  imports: [ConfigModule ,TenantsModule , IndustryTypeModule , UsersModule ],
  providers: [LoggerService , 
    TenantGuard,
    RolesGuard,
    JwtStrategy

  ],
  exports: [LoggerService],
})
export class SharedModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
