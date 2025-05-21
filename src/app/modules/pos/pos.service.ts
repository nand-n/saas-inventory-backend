import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale } from './entities/sale.entity';
import { JournalService } from '../accounting/journal.service';
import { InventoryItemService } from '../inventory/inventory-item.service';

@Injectable()
export class PosService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly journalService: JournalService,
    private readonly inventoryService: InventoryItemService,
  ) {}

  async createSale(dto: CreateSaleDto) {
    const { tenantId } = dto;
    if (!tenantId)
      throw new UnauthorizedException('Tenant ID not found in request');
    return await this.dataSource.transaction(async (manager) => {
      const saleRepo = manager.getRepository(Sale);
      const sale = saleRepo.create({
        tenantId: dto.tenantId,
        lines: dto.lines,
      });
      await saleRepo.save(sale);

      for (const line of dto.lines) {
        await this.inventoryService.decreaseQuantity(
          line.itemId,
          line.qty,
          // manager,
        );
      }

      const totalRevenue = dto.lines.reduce(
        (sum, line) => sum + line.qty * line.unitPrice,
        0,
      );
      const totalCOGS = dto.lines.reduce(
        (sum, line) => sum + line.qty * line.unitCost,
        0,
      );

      await this.journalService.create(
        {
          tenantId: dto.tenantId ?? '',
          date: new Date(),
          description: `Sale #${sale.id}`,
          lines: [
            {
              accountId: dto.salesRevenueAccountId,
              debit: totalRevenue,
              credit: 0,
            },
            {
              accountId: dto.salesRevenueAccountId,
              debit: 0,
              credit: totalRevenue,
            },
          ],
        },
        // manager,
      );
      await this.journalService.create(
        {
          tenantId: tenantId ?? '',
          date: new Date(),
          description: `COGS for Sale #${sale.id}`,
          lines: [
            { accountId: dto.cogsAccountId, debit: totalCOGS, credit: 0 },
            { accountId: dto.inventoryAccountId, debit: 0, credit: totalCOGS },
          ],
        },
        // manager,
      );

      return sale;
    });
  }
}
