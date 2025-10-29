import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PayrollRun, PayrollRunStatus } from './entities/payroll-run.entity';
import { PayrollsService } from './payrolls.service';
import { CreatePayrollRunDto } from './dto/create-payroll-run.dto';
import { Payroll } from './entities/payroll.entity';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollRunDto } from './dto/update-payroll-run.dto';


@Injectable()
export class PayrollRunService {
  constructor(
    @InjectRepository(PayrollRun)
    private readonly runRepo: Repository<PayrollRun>,


    private readonly payrollService: PayrollsService,
  ) {}

  /**
   * Create a payroll run dynamically
   * - Can either create payrolls inline or attach existing ones
   */
async create(dto: CreatePayrollRunDto): Promise<PayrollRun> {
  if (!dto.name) throw new BadRequestException('Payroll run name is required');
  if (!dto.periodStart || !dto.periodEnd) {
    throw new BadRequestException('Payroll period start and end are required');
  }

  const run = this.runRepo.create({
    name: dto.name,
    periodStart: new Date(dto.periodStart),
    periodEnd: new Date(dto.periodEnd),
    payDate: dto.payDate ? new Date(dto.payDate) : new Date(),
    status: dto.status ?? PayrollRunStatus.DRAFT,
    metadata: dto.metadata,
  });

  let payrolls: Payroll[] = [];

  // === OPTION 1: Create payrolls inline with adjustments (use service.create) ===
  if (dto.payrolls?.length) {
    for (const payrollDto of dto.payrolls) {
      const created = await this.payrollService.create({
        ...payrollDto,
        payPeriodStart: new Date(dto.periodStart),
        payPeriodEnd: new Date(dto.periodEnd),
        // payDate: dto.payDate,
      });
      // created.run will not be set by payrollService.create, so set it here for totals
      created.run = run;
      payrolls.push(created);
    }
  }

  // === OPTION 2: Attach existing payrolls by ID, but re-create them via payrollService.create ===
  // (this duplicates payrolls but ensures all writes go through the service)
  if (dto.payrollIds?.length) {
    const existing = await this.payrollService.findMany(dto.payrollIds);
    if (existing.length !== dto.payrollIds.length) {
      throw new NotFoundException('One or more payrolls not found');
    }

    for (const ex of existing) {
      // Build a CreatePayrollDto from the existing payroll entity.
      // Adjust field names where necessary — ensure CreatePayrollDto matches.
      const createDto: CreatePayrollDto = {
        employeeId: ex.employee?.id ?? ex['employeeId'],
        payPeriodStart: ex.payPeriodStart ?? dto.periodStart,
        payPeriodEnd: ex.payPeriodEnd ?? dto.periodEnd,
        payDate: ex.payDate ?? dto.payDate,
        hoursWorked: ex.hoursWorked,
        overtimeHours: ex.overtimeHours,
        grossPay: ex.grossPay,
        netPay: ex.netPay,
        status: ex.status,
        type: ex.type,
        deductionDetails: ex.deductionDetails,
        notes: ex.notes,
        salaryExpenseAccountId: ex.salaryExpenseAccountId,
        taxesPayableAccountId: ex.taxesPayableAccountId,
        bankAccountId: ex.bankAccountId,
        accruedPayrollLiabilityAccountId: ex.accruedPayrollLiabilityAccountId,
        adjustments: (ex.adjustments || []).map((a) => ({
        employeeId: a.employee?.id,
        type: a.type,
        direction: a.direction,
        amount: Number(a.amount) || 0,
        reason: a.reason ?? undefined,
        isRecurring: a.isRecurring ?? false,
        effectiveDate:a.effectiveDate?.toString(),
        policyCode: a.policyCode ?? undefined,
        debitAccountId: a.debitAccountId as string,
        creditAccountId: a.creditAccountId as string,
        metadata: a.metadata ?? {},
      })),
      };

      // Create a new payroll via service (keeps service boundary)
      const recreated = await this.payrollService.create(createDto);
      recreated.run = run;
      payrolls.push(recreated);
    }
  }

  // Totals
  run.totalGrossPay = payrolls.reduce((sum, p) => sum + Number(p.grossPay || 0), 0);
  run.totalNetPay = payrolls.reduce((sum, p) => sum + Number(p.netPay || 0), 0);
  run.totalDeductions = run.totalGrossPay - run.totalNetPay;
  run.payrolls = payrolls;

  // Persist the run
  const savedRun = await this.runRepo.save(run);

  // Return with relations (ensure non-null)
  const payrollRun = await this.runRepo.findOne({
    where: { id: savedRun.id },
    relations: ['payrolls', 'payrolls.employee', 'payrolls.adjustments'],
  });
  if (!payrollRun) {
    throw new NotFoundException('Payroll run not found after save');
  }
  return payrollRun;
}

async findAll(): Promise<PayrollRun[]> {
  return this.runRepo.find({
    relations: ['payrolls', 'payrolls.employee', 'payrolls.adjustments'],
  });
}

async updateStatus(id: string, newStatus: PayrollRunStatus): Promise<PayrollRun> {
    const run = await this.runRepo.findOne({ where: { id } });
    if (!run) throw new NotFoundException('Payroll run not found');

    // 🔒 Enforce logical transitions
    const validTransitions: Record<PayrollRunStatus, PayrollRunStatus[]> = {
      [PayrollRunStatus.DRAFT]: [PayrollRunStatus.PROCESSING, PayrollRunStatus.CANCELLED],
      [PayrollRunStatus.PROCESSING]: [PayrollRunStatus.COMPLETED, PayrollRunStatus.CANCELLED],
      [PayrollRunStatus.COMPLETED]: [PayrollRunStatus.APPROVED, PayrollRunStatus.CANCELLED],
      [PayrollRunStatus.APPROVED]: [], // terminal
      [PayrollRunStatus.CANCELLED]: [], // terminal
    };

    const allowedNextStatuses = validTransitions[run.status] || [];
    if (!allowedNextStatuses.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${run.status} → ${newStatus}`,
      );
    }
    const oldStatus = run.status

    run.status = newStatus;

    // Optionally track metadata
    if (!run.metadata) run.metadata = {};
    run.metadata.history = [
      ...(run.metadata.history || []),
      {
        from: run.status,
        to: newStatus,
        changedAt: new Date(),
      },
    ];

    return this.runRepo.save(run);
  }

  async update(id: string, dto: UpdatePayrollRunDto): Promise<PayrollRun> {
  const run = await this.runRepo.findOne({
    where: { id },
    relations: ['payrolls', 'payrolls.employee', 'payrolls.adjustments'],
  });

  if (!run) throw new NotFoundException('Payroll run not found');

  // === BASIC VALIDATION ===
  if (dto.name !== undefined) run.name = dto.name;
  if (dto.periodStart) run.periodStart = new Date(dto.periodStart);
  if (dto.periodEnd) run.periodEnd = new Date(dto.periodEnd);
  if (dto.payDate) run.payDate = new Date(dto.payDate);
  if (dto.status) run.status = dto.status;
  if (dto.metadata) run.metadata = dto.metadata;

  // === HANDLE PAYROLL UPDATES ===
  let payrolls: Payroll[] = [];

  // === OPTION 1: Update or recreate inline payrolls ===
  if (dto.payrolls?.length) {
    payrolls = [];
    for (const payrollDto of dto.payrolls) {
      const created = await this.payrollService.create({
        ...payrollDto,
        payPeriodStart: new Date(dto.periodStart ?? run.periodStart),
        payPeriodEnd: new Date(dto.periodEnd ?? run.periodEnd),
      });
      created.run = run;
      payrolls.push(created);
    }
  }

  // === OPTION 2: Recreate from existing payroll IDs ===
  if (dto.payrollIds?.length) {
    const existing = await this.payrollService.findMany(dto.payrollIds);
    if (existing.length !== dto.payrollIds.length) {
      throw new NotFoundException('One or more payrolls not found');
    }

    for (const ex of existing) {
      const createDto: CreatePayrollDto = {
        employeeId: ex.employee?.id ?? ex['employeeId'],
        payPeriodStart: ex.payPeriodStart ?? dto.periodStart ?? run.periodStart,
        payPeriodEnd: ex.payPeriodEnd ?? dto.periodEnd ?? run.periodEnd,
        payDate: ex.payDate ?? dto.payDate ?? run.payDate,
        hoursWorked: ex.hoursWorked,
        overtimeHours: ex.overtimeHours,
        grossPay: ex.grossPay,
        netPay: ex.netPay,
        status: ex.status,
        type: ex.type,
        deductionDetails: ex.deductionDetails,
        notes: ex.notes,
        salaryExpenseAccountId: ex.salaryExpenseAccountId,
        taxesPayableAccountId: ex.taxesPayableAccountId,
        bankAccountId: ex.bankAccountId,
        accruedPayrollLiabilityAccountId: ex.accruedPayrollLiabilityAccountId,
        adjustments: (ex.adjustments || []).map((a) => ({
          employeeId: a.employee?.id,
          type: a.type,
          direction: a.direction,
          amount: Number(a.amount) || 0,
          reason: a.reason ?? undefined,
          isRecurring: a.isRecurring ?? false,
          effectiveDate: a.effectiveDate?.toString(),
          policyCode: a.policyCode ?? undefined,
          debitAccountId: a.debitAccountId as string,
          creditAccountId: a.creditAccountId as string,
          metadata: a.metadata ?? {},
        })),
      };

      const recreated = await this.payrollService.create(createDto);
      recreated.run = run;
      payrolls.push(recreated);
    }
  }

  // === MERGE PAYROLLS IF ANY WERE CREATED ===
  if (payrolls.length > 0) {
    run.payrolls = payrolls;
    run.totalGrossPay = payrolls.reduce(
      (sum, p) => sum + Number(p.grossPay || 0),
      0,
    );
    run.totalNetPay = payrolls.reduce(
      (sum, p) => sum + Number(p.netPay || 0),
      0,
    );
    run.totalDeductions = run.totalGrossPay - run.totalNetPay;
  }

  // === PERSIST CHANGES ===
  const saved = await this.runRepo.save(run);

  // === RETURN UPDATED ENTITY WITH RELATIONS ===
  const updatedRun = await this.runRepo.findOne({
    where: { id: saved.id },
    relations: ['payrolls', 'payrolls.employee', 'payrolls.adjustments'],
  });

  if (!updatedRun) throw new NotFoundException('Payroll run not found after update');
  return updatedRun;
}


}
