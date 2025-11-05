import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodsReceiptService } from './goods-receipt.service';
import { GoodsReceiptController } from './goods-receipt.controller';
import { GoodsReceipt } from './entities/grn.entity';
import { GRNItem } from './entities/grn-item.entity';
import { PurchaseOrder } from '../purchase-order/entities/purchase-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GoodsReceipt, GRNItem, PurchaseOrder])],
  controllers: [GoodsReceiptController],
  providers: [GoodsReceiptService],
  exports: [GoodsReceiptService],
})
export class GoodsReceiptModule {}
