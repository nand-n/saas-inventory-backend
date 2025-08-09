import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';
import { PurchaseOrder } from '../purchase-order/entities/purchase-order.entity';
import { PurchaseOrderItemService } from './purchase-order-item.service';
import { PurchaseOrderItemController } from './purchase-order-item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrderItem, PurchaseOrder])],
  controllers: [PurchaseOrderItemController],
  providers: [PurchaseOrderItemService],
})
export class PurchaseOrderItemModule {}
