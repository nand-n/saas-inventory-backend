import { Global, Module } from '@nestjs/common';
import { TenantsModule } from './modules/tenants/tenants.module';
import { BranchsModule } from './modules/branchs/branchs.module';
import { IndustryTypeModule } from './modules/industryType/industry-type.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionsModule } from './modules/permission/permissions.module';
import { ConfigurationsModule } from './modules/configurations/configurations.module';
import { ChapaModule } from './modules/chapa-sdk';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentModule } from './modules/payment/payment.module';
import { PaymentMethodModule } from './modules/payment-method/payment-method.module';
import { PlanModule } from './modules/plan/plan.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { SubscriptionPlanModule } from './modules/subscription-plan/subscription-plan.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { RouterModule } from '@nestjs/core';
// import { CoaModule } from './modules/chart-of-account/coa.module';
import { AccountingModule } from './modules/accounting/accounting.module';
import { PosModule } from './modules/pos/pos.module';

@Global()
@Module({
  imports: [
    TenantsModule,
    BranchsModule,
    IndustryTypeModule,
    UsersModule,
    AuthModule,
    PermissionsModule,
    ConfigurationsModule,
    PaymentModule,
    PaymentMethodModule,
    PlanModule,
    InvoiceModule,
    SubscriptionPlanModule,
    InventoryModule,
    // CoaModule,
    AccountingModule,
    PosModule,
    RouterModule.register([
      {
        path: 'inventory',
        module: InventoryModule,
      },
      {
        path: 'accounting',
        module: AccountingModule,
      },
    ]),
    ChapaModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secretKey:
          configService.get<string>('payment.chapaSecretKey') ||
          'defaultSecretKey',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class CoreModule {}
