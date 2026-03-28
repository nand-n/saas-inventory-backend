import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from '../supliers/entities/suplier.entity';
import { RFQController } from './rfq.controller';
import { RFQService } from './rfq.service';
import { RFQ } from './entities/rfq.entity';
import { RFQItem } from './entities/rfq-item.entity';
import { ProductsModule } from '../product/products.module';
import { RFQSupplier } from './entities/rfq-supplier.entity';
import { RFQSupplierItem } from './entities/rfq-supplier-item.entity';
import { PurchaseOrder } from '../purchase-order/entities/purchase-order.entity';
import { PurchaseOrderItem } from '../purchase-order/entities/purchase-order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RFQ, RFQItem, RFQSupplier, RFQSupplierItem, Supplier, PurchaseOrder, PurchaseOrderItem]), ProductsModule],
  controllers: [RFQController],
  providers: [RFQService],
  exports: [RFQService]
})
export class RFQModule { }
