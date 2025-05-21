import { Module } from '@nestjs/common';
import { InventoryItemController } from './inventory-item.controller';
import { InventoryCategoryController } from './inventory-category.controller';
import { InventoryItemService } from './inventory-item.service';
import { InventoryCategoryService } from './inventory-category.service';
import { BranchInventoryController } from './branch-inventory.controller';
import { BranchInventoryService } from './branch-inventory.service';
import { StockAdjustmentController } from './stock-adustment.controller';
import { StockAdjustmentService } from './stock-adjustment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchInventory } from './entities/branch-inventory.entity';
import { InventoryCategory } from './entities/inventory-category.entity';
import { InventoryItem } from './entities/inventory-item.entity';
import { StockAdjustment } from './entities/stock-adjustment.entity';
import { StockTransfer } from './entities/stock-transfer.entity';
import { StockTransferController } from './stock-transfer.controller';
import { StockTransferService } from './stock-transfer.service';
import { TenantInventoryController } from './tenant-inventory.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AccountingModule } from '../accounting/accounting.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BranchInventory,
      InventoryCategory,
      InventoryItem,
      StockAdjustment,
      StockTransfer,
    ]),
    JwtModule,
    UsersModule,
    AccountingModule,
  ],
  controllers: [
    InventoryItemController,
    BranchInventoryController,
    InventoryCategoryController,
    StockAdjustmentController,
    StockTransferController,
    TenantInventoryController,
  ],
  providers: [
    InventoryItemService,
    BranchInventoryService,
    InventoryCategoryService,
    StockAdjustmentService,
    StockTransferService,
  ],
  exports: [
    InventoryItemService,
    BranchInventoryService,
    InventoryCategoryService,
    StockAdjustmentService,
    StockTransferService,
  ],
})
export class InventoryModule {}
