import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '../product/products.module';
import { SalesOrder } from './entities/sales-order.entity';
import { SalesOrderService } from './sales-order.service';
import { SalesOrderController } from './sales-order.controller';
import { SalesOrderItem } from './entities/sales-order-item.entity';
import { CustomersModule } from '../customers/customer.module';
import { Customer } from '../customers/entities/customers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SalesOrder , SalesOrderItem , Customer]) , ProductsModule , CustomersModule],
  providers: [SalesOrderService],
  controllers: [SalesOrderController],
  exports: [SalesOrderService],
})
export class SalesOrderModule {}