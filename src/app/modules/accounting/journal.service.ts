import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  DataSource,
  EntityManager,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Journal } from './entities/journal.entity';
import { JournalLine } from './entities/journal-line.entity';
import {
  CashFlowCategory,
  ChartOfAccount,
} from './entities/chart-of-account.entity';
import { CreateJournalDto } from './dto/create-journal.dto';
import { Tenant } from '../tenants/entities/tenants.entity';

export interface FinancialSummary {
  totalDebit: number;
  totalCredit: number;
  categories: {
    [categoryName: string]: {
      debit: number;
      credit: number;
      cashFlowCategory?: CashFlowCategory | null;
    };
  };
  profitAndLoss: {
    revenue: number;
    expenses: number;
    netIncome: number;
  };
  balanceSheet: {
    assets: number;
    liabilities: number;
    equity: number;
  };
  cashFlow: {
    operating: number;
    investing: number;
    financing: number;
  };
}
@Injectable()
export class JournalService {
  constructor(
    @InjectRepository(Journal)
    private journalRepo: Repository<Journal>,
    @InjectRepository(JournalLine)
    private lineRepo: Repository<JournalLine>,
    @InjectRepository(ChartOfAccount)
    private coaRepo: Repository<ChartOfAccount>,
    @InjectRepository(Tenant)
    private tenantRepo: Repository<Tenant>,
    private dataSource: DataSource,
  ) {}

  async create(
    dto: CreateJournalDto,
    manager?: EntityManager,
  ): Promise<Journal> {
    const queryRunner =
      manager?.queryRunner || this.dataSource.createQueryRunner();

    if (!manager) {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    }

    try {
      // VALIDATION PHASE (keep original repository calls)
      const tenant = await this.tenantRepo.findOneBy({ id: dto.tenantId });
      if (!tenant) {
        throw new NotFoundException(`Tenant ${dto.tenantId} not found`);
      }

      // Create journal instance (same as before)
      const journal = this.journalRepo.create({
        date: dto.date,
        description: dto.description,
        tenant,
      });

      // LINE VALIDATION (keep original repository pattern)
      const lines = await Promise.all(
        dto.lines.map(async (line) => {
          const account = await this.coaRepo.findOne({
            where: { id: line.accountId, tenant: { id: dto.tenantId } },
            relations: ['category'],
          });

          if (!account) {
            throw new NotFoundException(
              `Account ${line.accountId} not found in tenant ${dto.tenantId}`,
            );
          }
          if (!account.isActive) {
            throw new ConflictException(
              `Account ${account.category.code} is inactive`,
            );
          }
          return this.lineRepo.create({
            account,
            debit: line.debit,
            credit: line.credit,
          });
        }),
      );

      // VALIDATION CHECKS (keep original logic)
      const totalDebit = lines.reduce((sum, line) => sum + line.debit, 0);
      const totalCredit = lines.reduce((sum, line) => sum + line.credit, 0);
      if (totalDebit !== totalCredit) {
        throw new BadRequestException(
          `Unbalanced journal entry (Debit: ${totalDebit} ≠ Credit: ${totalCredit})`,
        );
      }
      if (lines.length < 2) {
        throw new BadRequestException('Journal must have at least two entries');
      }

      // SAVE OPERATIONS (use transaction-aware manager)
      const operationManager = manager || queryRunner.manager;
      const savedJournal = await operationManager.save(journal);
      lines.forEach((line) => (line.journal = savedJournal));
      await operationManager.save(lines);

      // COMMIT ONLY IF WE CREATED THE TRANSACTION
      if (!manager) {
        await queryRunner.commitTransaction();
      }

      // USE REPOSITORY TO FETCH AFTER COMMIT
      const result = await this.journalRepo.findOne({
        where: { id: savedJournal.id, tenant: { id: dto.tenantId } },
        relations: ['lines', 'lines.account', 'tenant'],
      });

      if (!result) {
        throw new NotFoundException(
          `Journal ${savedJournal.id} not found after creation`,
        );
      }

      return result;
    } catch (error) {
      // ROLLBACK ONLY IF WE OWN THE TRANSACTION
      if (!manager) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      // RELEASE ONLY IF WE CREATED THE RUNNER
      if (!manager) {
        await queryRunner.release();
      }
    }
  }
  async findAll(tenantId: string): Promise<Journal[]> {
    return this.journalRepo.find({
      where: { tenant: { id: tenantId } },
      relations: ['lines', 'lines.account', 'lines.account.category'],
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string, tenantId: string): Promise<Journal> {
    const journal = await this.journalRepo.findOne({
      where: { id, tenant: { id: tenantId } },
      relations: [
        'lines',
        'lines.account',
        'lines.account.category',
        'lines.account.parent',
      ],
    });

    if (!journal) {
      throw new NotFoundException(`Journal ${id} not found`);
    }
    return journal;
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const journal = await this.findOne(id, tenantId);
    const result = await this.journalRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Journal ${id} not found`);
    }
  }
  async getFinancialSummary(
    tenantId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const where: any = { tenant: { id: tenantId } };

    if (startDate && endDate) {
      where.date = Between(new Date(startDate), new Date(endDate));
    } else if (startDate) {
      where.date = MoreThanOrEqual(new Date(startDate));
    } else if (endDate) {
      where.date = LessThanOrEqual(new Date(endDate));
    }

    const journals = await this.journalRepo.find({
      where, // uncommented this line to apply date filtering
      relations: ['lines', 'lines.account', 'lines.account.category'],
    });

    const summary = {
      totalDebit: 0,
      totalCredit: 0,
      categories: {},
      profitAndLoss: {
        revenue: 0,
        expenses: 0,
        netIncome: 0,
      },
      balanceSheet: {
        assets: 0,
        liabilities: 0,
        equity: 0,
      },
      cashFlow: {
        operating: 0,
        investing: 0,
        financing: 0,
      },
    };

    for (const journal of journals) {
      for (const line of journal.lines) {
        const { debit, credit, account } = line;
        const category = account.category;
        const categoryName = category?.name || 'Unknown';

        // Total debit and credit
        summary.totalDebit += +debit;
        summary.totalCredit += +credit;

        // Category totals
        if (!summary.categories[categoryName]) {
          summary.categories[categoryName] = { debit: 0, credit: 0 };
        }
        summary.categories[categoryName].debit += +debit;
        summary.categories[categoryName].credit += +credit;

        const code = category?.code || '';

        // === Profit and Loss ===
        if (code.startsWith('4')) {
          // Revenue
          summary.profitAndLoss.revenue += +credit;
        } else if (code.startsWith('5')) {
          // Expenses
          summary.profitAndLoss.expenses += +debit;
        }

        // === Balance Sheet ===
        if (code.startsWith('1')) {
          summary.balanceSheet.assets += +debit - +credit;
        } else if (code.startsWith('2')) {
          summary.balanceSheet.liabilities += +credit - +debit;
        } else if (code.startsWith('3')) {
          summary.balanceSheet.equity += +credit - +debit;
        }

        // === Cash Flow ===
        const cfType = account.cashFlowCategory;
        const amount = +debit - +credit;
        if (cfType === 'operating') {
          summary.cashFlow.operating += amount;
        } else if (cfType === 'investing') {
          summary.cashFlow.investing += amount;
        } else if (cfType === 'financing') {
          summary.cashFlow.financing += amount;
        }
      }
    }

    // Final net income
    summary.profitAndLoss.netIncome =
      summary.profitAndLoss.revenue - summary.profitAndLoss.expenses;

    // Push net income to equity (retained earnings or similar logic)
    summary.balanceSheet.equity += summary.profitAndLoss.netIncome;

    // If using indirect cash flow method, you might skip this.
    summary.cashFlow.operating += summary.profitAndLoss.netIncome;

    return summary;
  }
}
