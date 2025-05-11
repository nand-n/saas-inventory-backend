import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlanService } from './subscription-plan.service';
import { SubscriptionPlanController } from './subscription-plan.controller';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { Plan } from '../plan/entities/plan.entity';
import { Invoice } from '../invoice/entities/invoice.entity';
import { PaymentMethod } from '../payment-method/entities/payment-method.entity';
import { InvoiceModule } from '../invoice/invoice.module';
import { PaymentMethodModule } from '../payment-method/payment-method.module';
import { PlanModule } from '../plan/plan.module';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { TenantsModule } from '../tenants/tenants.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionPlan, User , Plan, Invoice, PaymentMethod, Invoice]), InvoiceModule, PaymentMethodModule, PlanModule, UsersModule , TenantsModule],  
  controllers: [SubscriptionPlanController],
  providers: [SubscriptionPlanService],
  exports: [SubscriptionPlanService],
})
export class SubscriptionPlanModule {}
