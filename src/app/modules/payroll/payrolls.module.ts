import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payroll } from './entities/payroll.entity';
import { PayrollsService } from './payrolls.service';
import { PayrollsController } from './payrolls.controller';
import { AccountingModule } from '../accounting/accounting.module';
import { EmployeeModule } from '../hr/employee.module';


@Module({
  imports: [TypeOrmModule.forFeature([Payroll]) , AccountingModule , EmployeeModule],
  providers: [PayrollsService],
  controllers: [PayrollsController],
  exports: [PayrollsService],
})
export class PayrollsModule {}
