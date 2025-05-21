import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChartOfAccount } from './entities/chart-of-account.entity';
import { AccountCategory } from './entities/account-category.entity';
import { Journal } from './entities/journal.entity';
import { JournalLine } from './entities/journal-line.entity';
import { Tenant } from '../tenants/entities/tenants.entity';
import { ChartOfAccountController } from './chart-of-account.controller';
import { AccountCategoryController } from './account-category.controller';
import { JournalController } from './journal.controller';
import { ChartOfAccountService } from './chart-of-account.service';
import { AccountCategoryService } from './account-category.service';
import { JournalService } from './journal.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChartOfAccount,
      AccountCategory,
      Journal,
      JournalLine,
      Tenant,
    ]),
    JwtModule,
    UsersModule,
  ],
  controllers: [
    ChartOfAccountController,
    AccountCategoryController,
    JournalController,
  ],
  providers: [ChartOfAccountService, AccountCategoryService, JournalService],
  exports: [ChartOfAccountService, AccountCategoryService, JournalService],
})
export class AccountingModule {}
