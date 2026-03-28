import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenants.entity';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { IndustryTypeModule } from '../industryType/industry-type.module';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { BranchsModule } from '../branchs/branchs.module';
import { ConfigurationsModule } from '../configurations/configurations.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant]), IndustryTypeModule, UsersModule, JwtModule, BranchsModule, ConfigurationsModule],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule { }
