import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payroll } from './entities/payroll.entity';
import { PayrollsService } from './payrolls.service';
import { PayrollsController } from './payrolls.controller';
import { AccountingModule } from '../accounting/accounting.module';
import { EmployeeModule } from '../hr/employee.module';
import { PayrollAdjustment } from './entities/payroll-adjestment.entity';
import { PayrollAdjustmentsService } from './payroll-adjustments.service';


@Module({
  imports: [TypeOrmModule.forFeature([Payroll , PayrollAdjustment]) , AccountingModule , EmployeeModule],
  providers: [PayrollsService, PayrollAdjustmentsService],
  controllers: [PayrollsController],
  exports: [PayrollsService, PayrollAdjustmentsService],
})
export class PayrollsModule {}
