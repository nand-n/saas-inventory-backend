import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { AdjustmentDirection, PayrollAdjustment } from './entities/payroll-adjestment.entity';
import { Payroll } from './entities/payroll.entity';
import { JournalService } from '../accounting/journal.service';
import { EmployeeService } from '../hr/employee.service';
import { CreatePayrollAdjustmentDto } from './dto/create-payroll-adjestime.dto';
import { CreateJournalDto } from '../accounting/dto/create-journal.dto';
import { UpdatePayrollAdjustmentDto } from './dto/update-payroll-adjustment.dto';

@Injectable()
export class PayrollAdjustmentsService {
  constructor(
    @InjectRepository(PayrollAdjustment)
    private readonly repo: Repository<PayrollAdjustment>,

    @InjectRepository(Payroll)
    private readonly payrollRepo: Repository<Payroll>,

    private readonly journalService: JournalService,
    private readonly employeeService: EmployeeService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * ✅ Create a new payroll adjustment (addition or deduction)
   */
  async create(dto: CreatePayrollAdjustmentDto): Promise<PayrollAdjustment> {
    const employee = await this.employeeService.findOne(dto.employeeId);
    if (!employee) throw new NotFoundException('Employee not found');

    const payroll = dto.payrollId
      ? await this.payrollRepo.findOne({ where: { id: dto.payrollId } })
      : null;

    if (!dto.debitAccountId || !dto.creditAccountId) {
      throw new BadRequestException('Missing required Chart of Account IDs');
    }

    const description = `${dto.direction === AdjustmentDirection.ADDITION ? 'Addition' : 'Deduction'} (${dto.type}) for ${employee.firstName} ${employee.lastName}: ${dto.reason ?? ''}`;

    // 🧾 Journal Entry Setup
    const journalDto: CreateJournalDto = {
      tenantId: employee.user?.tenantId ?? '',
      date: new Date(),
      description,
      lines: [],
    };

    if (dto.direction === AdjustmentDirection.ADDITION) {
      // e.g., Salary Allowance, Bonus, Overtime
      journalDto.lines.push(
        {
          accountId: dto.debitAccountId, // Expense or Payroll Expense
          debit: dto.amount,
          credit: 0,
        },
        {
          accountId: dto.creditAccountId, // Liability or Payable
          debit: 0,
          credit: dto.amount,
        },
      );
    } else {
      // Deduction (Loan, Fine, Tax)
      journalDto.lines.push(
        {
          accountId: dto.debitAccountId, // Liability (reversal)
          debit: dto.amount,
          credit: 0,
        },
        {
          accountId: dto.creditAccountId, // Expense or Payable decrease
          debit: 0,
          credit: dto.amount,
        },
      );
    }

    await this.journalService.create(journalDto);

    const adjustment = this.repo.create({
      ...dto,
      employee,
      payroll: payroll ?? undefined,
    });

    return await this.repo.save(adjustment);
  }

  async bulkCreate(dtos: CreatePayrollAdjustmentDto[]): Promise<PayrollAdjustment[]> {
  if (!dtos || !dtos.length) {
    throw new BadRequestException('No payroll adjustments provided');
  }

  console.log(dtos , "*********** what is the data ")
  // Use query runner for transaction safety
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const createdAdjustments: PayrollAdjustment[] = [];

    for (const dto of dtos) {
      const employee = await this.employeeService.findOne(dto.employeeId);
      if (!employee) throw new NotFoundException(`Employee ${dto.employeeId} not found`);

      const payroll = dto.payrollId
        ? await this.payrollRepo.findOne({ where: { id: dto.payrollId } })
        : null;

      if (!dto.debitAccountId || !dto.creditAccountId) {
        throw new BadRequestException(
          `Missing required Chart of Account IDs for employee ${employee.firstName} ${employee.lastName}`,
        );
      }

      const description = `${
        dto.direction === AdjustmentDirection.ADDITION ? 'Addition' : 'Deduction'
      } (${dto.type}) for ${employee.firstName} ${employee.lastName}: ${dto.reason ?? ''}`;

      const journalDto: CreateJournalDto = {
        tenantId: employee.user?.tenantId ?? '',
        date: new Date(),
        description,
        lines: [],
      };

      if (dto.direction === AdjustmentDirection.ADDITION) {
        // e.g., Allowance, Bonus, Overtime
        journalDto.lines.push(
          {
            accountId: dto.debitAccountId, // Expense
            debit: Number(dto.amount),
            credit: 0,
          },
          {
            accountId: dto.creditAccountId, // Liability or Payable
            debit: 0,
            credit: Number(dto.amount),
          },
        );
      } else {
        // Deduction (Loan, Fine, Tax)
        journalDto.lines.push(
          {
            accountId: dto.debitAccountId, // Liability (reversal)
            debit: Number(dto.amount),
            credit: 0,
          },
          {
            accountId: dto.creditAccountId, // Expense or Payable decrease
            debit: 0,
            credit: Number(dto.amount),
          },
        );
      }

      // Create journal entry
      await this.journalService.create(journalDto);

      // Create adjustment record
      const adjustment = this.repo.create({
        ...dto,
        amount:Number(dto.amount),
        employee,
        payroll: payroll ?? undefined,
      });

      const savedAdjustment = await queryRunner.manager.save(adjustment);
      createdAdjustments.push(savedAdjustment);
    }

    await queryRunner.commitTransaction();
    return createdAdjustments;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}



  /**
   * 💰 Process adjustment payment (e.g., bonus disbursement or deduction settlement)
   */
  async settleAdjustment(id: string): Promise<PayrollAdjustment> {
    const adjustment = await this.repo.findOne({
      where: { id },
      relations: ['employee', 'employee.user'],
    });

    if (!adjustment) throw new NotFoundException('Payroll adjustment not found');

    if (!adjustment.debitAccountId || !adjustment.creditAccountId) {
      throw new BadRequestException('Missing required Chart of Account IDs');
    }

    const journalDto: CreateJournalDto = {
      tenantId: adjustment.employee.user?.tenantId ?? '',
      date: new Date(),
      description: `Settlement for adjustment: ${adjustment.reason ?? adjustment.type}`,
      lines: [
        {
          accountId: adjustment.debitAccountId,
          debit: adjustment.amount,
          credit: 0,
        },
        {
          accountId: adjustment.creditAccountId,
          debit: 0,
          credit: adjustment.amount,
        },
      ],
    };

    await this.journalService.create(journalDto);

    adjustment.metadata = {
      ...(adjustment.metadata ?? {}),
      settledAt: new Date(),
    };

    adjustment.processedByPayroll = true;

    return await this.repo.save(adjustment);
  }

  findAll(): Promise<PayrollAdjustment[]> {
    return this.repo.find({
      relations: ['employee', 'payroll', 'debitAccount', 'creditAccount'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PayrollAdjustment> {
    const adjustment = await this.repo.findOne({
      where: { id },
      relations: ['employee', 'payroll'],
    });
    if (!adjustment) throw new NotFoundException(`Payroll adjustment #${id} not found`);
    return adjustment;
  }

  async update(id: string, dto: UpdatePayrollAdjustmentDto): Promise<PayrollAdjustment> {
    const adjustment = await this.findOne(id);
    Object.assign(adjustment, dto);
    return this.repo.save(adjustment);
  }

  async remove(id: string): Promise<void> {
    const adjustment = await this.findOne(id);
    await this.repo.remove(adjustment);
  }
}
