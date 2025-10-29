import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Payroll, PayrollStatus } from './entities/payroll.entity';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { JournalService } from '../accounting/journal.service';
import { EmployeeService } from '../hr/employee.service';
import { CreateJournalDto } from '../accounting/dto/create-journal.dto';
import { PayrollAdjustmentsService } from './payroll-adjustments.service';
import { AdjustmentDirection, AdjustmentType } from './entities/payroll-adjestment.entity';

@Injectable()
export class PayrollsService {
  constructor(
    @InjectRepository(Payroll)
    private readonly repo: Repository<Payroll>,
    private readonly journalService: JournalService,
    private readonly employeeService: EmployeeService,
    private readonly payrollAdjestimentService: PayrollAdjustmentsService,

  ) {}

async create(dto: CreatePayrollDto): Promise<Payroll> {
  const employee = await this.employeeService.findOne(dto.employeeId);
  if (!employee) throw new NotFoundException('Employee not found');

  const grossPay = Number(dto.grossPay || 0);
  let totalAdditions = 0;
  let totalDeductions = 0;

  // 🔹 Loop through adjustments
  for (const adj of dto.adjustments || []) {
    if (!adj) continue;

    let adjAmount = 0;

    switch (adj.type) {
      case AdjustmentType.TAX:
        // TAX = percentage of gross pay
        adjAmount = (grossPay * Number(adj.amount)) / 100;
        break;

      default:
        // All others = flat amount
        adjAmount = Number(adj.amount);
        break;
    }

    if (adj.direction === AdjustmentDirection.ADDITION) {
      totalAdditions += adjAmount;
    } else if (adj.direction === AdjustmentDirection.DEDUCTION) {
      totalDeductions += adjAmount;
    }

    // Store computed amount into metadata (optional, useful for logs)
    adj.metadata = {
      ...adj.metadata,
      computedAmount: adjAmount,
      originalAmount: adj.amount,
      basedOn: adj.type === AdjustmentType.TAX ? 'percentage' : 'flat',
    };
  }

  const netPay = grossPay + totalAdditions - totalDeductions;

  // === Journal ===
  const journalDto: CreateJournalDto = {
    tenantId: employee.user?.tenantId ?? '',
    date: dto.payDate,
    description: `Payroll for ${employee.firstName} ${employee.lastName}`,
    lines: [
      {
        accountId: dto.salaryExpenseAccountId,
        debit: grossPay + totalAdditions,
        credit: 0,
      },
      {
        accountId: dto.taxesPayableAccountId,
        debit: 0,
        credit: totalDeductions, // includes computed tax
      },
      {
        accountId: dto.accruedPayrollLiabilityAccountId,
        debit: 0,
        credit: netPay,
      },
    ],
  };
  await this.journalService.create(journalDto);

  // === Payroll record ===
  const payroll = this.repo.create({
    ...dto,
    grossPay,
    netPay,
    employee,
  });
  const createdPayroll = await this.repo.save(payroll);

  // === Persist Adjustments ===
  if (dto.adjustments?.length) {
    const adjustmentsWithPayroll = dto.adjustments.map((adj) => ({
      ...adj,
      payrollId: createdPayroll.id,
      employeeId: dto.employeeId,
      amount:
        adj.type === AdjustmentType.TAX
          ? (grossPay * Number(adj.amount)) / 100 // percent → value
          : Number(adj.amount),
    }));

    await this.payrollAdjestimentService.bulkCreate(adjustmentsWithPayroll);
  }

  const finalPayroll = await this.repo.findOne({
    where: { id: createdPayroll.id },
    relations: ['employee', 'adjustments'],
  });

  if (!finalPayroll)
    throw new NotFoundException(`Payroll #${createdPayroll.id} not found after creation`);

  return finalPayroll;
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
    return this.repo.find({ relations: ['employee' , "adjustments"] });
  }
    findMany(ids:string[]): Promise<Payroll[]> {
    return this.repo.find(
      {
       where: { id: In(ids) },
              relations: ['employee', 'adjustments'],
       }
    );
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

async bulkRemove(ids: string[]): Promise<void> {
  const payrolls = await this.repo.findBy({ id: In(ids) }); // Find all matching records
  if (!payrolls.length) throw new NotFoundException('No payrolls found for given IDs');

  await this.repo.remove(payrolls);
}

}
