import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configurations } from './entities/configurations.entity';
import { ConfigurationsService } from './configurations.service';
import { ConfigurationsController } from './configurations.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { OrganizationalNode } from './entities/organizational-node.entity';
import { BranchsModule } from '../branchs/branchs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Configurations,OrganizationalNode]) , JwtModule , UsersModule , BranchsModule],
  controllers: [ConfigurationsController],
  providers: [ConfigurationsService],
  exports: [ConfigurationsService],
})
export class ConfigurationsModule {}