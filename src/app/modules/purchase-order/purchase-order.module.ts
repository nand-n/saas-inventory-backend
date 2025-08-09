import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { Supplier } from '../supliers/entities/suplier.entity';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderController } from './purchase-order.controller';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrder,PurchaseOrderItem ,Supplier])],
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService],
})
export class PurchaseOrderModule {}
