import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";
import { PaginationService } from "@root/src/core/pagination/pagination.service";
import { HttpModule } from "@nestjs/axios";

import { SubscriptionPlanModule } from "../subscription-plan/subscription-plan.module";
import { InvoiceModule } from "../invoice/invoice.module";
import { User } from "../users/entities/user.entity";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User]) , HttpModule , UsersModule, SubscriptionPlanModule , InvoiceModule],
  controllers: [PaymentController],
  providers: [PaymentService,PaginationService],
  exports:[PaymentModule]
})
export class PaymentModule {}