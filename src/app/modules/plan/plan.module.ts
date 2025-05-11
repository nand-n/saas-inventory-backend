import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { Plan } from './entities/plan.entity';
import { PaymentMethod } from '../payment-method/entities/payment-method.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, PaymentMethod])],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [PlanService],
})
export class PlanModule {}
