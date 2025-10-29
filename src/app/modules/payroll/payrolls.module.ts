import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payroll } from './entities/payroll.entity';
import { PayrollsService } from './payrolls.service';
import { PayrollsController } from './payrolls.controller';
import { AccountingModule } from '../accounting/accounting.module';
import { EmployeeModule } from '../hr/employee.module';
import { PayrollAdjustment } from './entities/payroll-adjestment.entity';
import { PayrollAdjustmentsService } from './payroll-adjustments.service';
import { PayrollRun } from './entities/payroll-run.entity';
import { PayrollRunService } from './payroll-run.service';


@Module({
  imports: [TypeOrmModule.forFeature([Payroll , PayrollAdjustment , PayrollRun]) , AccountingModule , EmployeeModule],
  providers: [PayrollsService, PayrollAdjustmentsService , PayrollRunService],
  controllers: [PayrollsController],
  exports: [PayrollsService, PayrollAdjustmentsService, PayrollRunService],
})
export class PayrollsModule {}
