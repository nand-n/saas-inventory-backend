import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChartOfAccount } from './entities/chart-of-account.entity';
import { AccountCategory } from './entities/account-category.entity';

import { CoaService } from './coa.service';
import { AccountCategoryService } from './account-category.service';

import { CoaController } from './coa.controller';
import { AccountCategoryController } from './account-category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChartOfAccount, AccountCategory])],
  controllers: [CoaController, AccountCategoryController],
  providers: [CoaService, AccountCategoryService],
  exports: [CoaService, AccountCategoryService],
})
export class CoaModule {}
