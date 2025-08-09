import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payroll, PayrollStatus } from './entities/payroll.entity';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { JournalService } from '../accounting/journal.service';
import { EmployeeService } from '../hr/employee.service';
import { CreateJournalDto } from '../accounting/dto/create-journal.dto';

@Injectable()
export class PayrollsService {
  constructor(
    @InjectRepository(Payroll)
    private readonly repo: Repository<Payroll>,
    private readonly journalService: JournalService,
    private readonly employeeService: EmployeeService,

  ) {}


async create(dto: CreatePayrollDto): Promise<Payroll> {
  const employee = await this.employeeService.findOne(dto.employeeId);

  if (!employee) {
    throw new NotFoundException('Employee not found');
  }

  // 2️⃣ Validate COA IDs
  if (
    !dto.salaryExpenseAccountId ||
    !dto.accruedPayrollLiabilityAccountId ||
    !dto.taxesPayableAccountId ||
    !dto.bankAccountId
  ) {
    throw new BadRequestException('Missing required Chart of Account IDs');
  }

  // 3️⃣ Calculate totals
  const grossPay = dto.grossPay;
  const taxes = 
    (dto.federalTax || 0) +
    (dto.stateTax || 0) +
    (dto.socialSecurityTax || 0) +
    (dto.medicareTax || 0);
  const netPay = dto.netPay;

  // 4️⃣ Build Journal DTO
  const journalDto: CreateJournalDto = {
    tenantId: employee.user.tenantId ?? '',
    date: dto.payDate,
    description: `Payroll for ${employee.firstName} ${employee.lastName}`,
    lines: [
      // Salaries Expense (debit)
      {
        accountId: dto.salaryExpenseAccountId,
        debit: grossPay,
        credit: 0,
      },
      // Taxes Payable (credit)
      {
        accountId: dto.taxesPayableAccountId,
        debit: 0,
        credit: taxes,
      },
      // Net Pay Liability (credit)
      {
        accountId: dto.accruedPayrollLiabilityAccountId,
        debit: 0,
        credit: netPay,
      },
    ],
  };

  // Optional: When paying immediately, you can also do:
  // Debit Net Pay Liability, Credit Bank (when paid out).

  // 5️⃣ Create Journal
  await this.journalService.create(journalDto);

  // 6️⃣ Create Payroll record
  const payroll = this.repo.create(dto);
  payroll.employee = employee;

  return await this.repo.save(payroll);
}

async payPayroll(payrollId: string): Promise<Payroll> {
  // 1️⃣ Find the payroll with employee and necessary account IDs
  const payroll = await this.repo.findOne({
    where: { id: payrollId },
    relations: ['employee', 'employee.user' , ], // to get tenantId if needed
  });

  if (!payroll) {
    throw new NotFoundException('Payroll not found');
  }

  // 2️⃣ Check if payroll is already paid to avoid double payments
  if (payroll.status === PayrollStatus.PAID) {
    throw new BadRequestException('Payroll is already paid');
  }

  // 3️⃣ Validate required account IDs for payment
  if (
    !payroll.accruedPayrollLiabilityAccountId ||
    !payroll.bankAccountId
  ) {
    throw new BadRequestException('Missing required Chart of Account IDs for payment');
  }

  // 4️⃣ Create journal entry to pay the employee
  const journalDto: CreateJournalDto = {
    tenantId: payroll.employee.user.tenantId ?? '',
    date: new Date(),
    description: `Payment of payroll for ${payroll.employee.firstName} ${payroll.employee.lastName}`,
    lines: [
      {
        accountId: payroll.accruedPayrollLiabilityAccountId, 
        debit: payroll.netPay,
        credit: 0,
      },
      {
        accountId: payroll.bankAccountId, 
        debit: 0,
        credit: payroll.netPay,
      },
    ],
  };

  await this.journalService.create(journalDto);

  payroll.status = PayrollStatus.PAID;
  return this.repo.save(payroll);
}



  findAll(): Promise<Payroll[]> {
    return this.repo.find({ relations: ['employee'] });
  }

  async findOne(id: string): Promise<Payroll> {
    const payroll = await this.repo.findOne({where:{id},  relations: ['employee'] });
    if (!payroll) throw new NotFoundException(`Payroll #${id} not found`);
    return payroll;
  }

  async update(id: string, dto: UpdatePayrollDto): Promise<Payroll> {
    const payroll = await this.findOne(id);
    Object.assign(payroll, dto);
    return this.repo.save(payroll);
  }

  async remove(id: string): Promise<void> {
    const payroll = await this.findOne(id);
    await this.repo.remove(payroll);
  }
}
