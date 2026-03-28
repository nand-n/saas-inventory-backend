import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { SalesOrderModule } from '../sales-order/sales-order.module';
import { PurchaseOrderModule } from '../purchase-order/purchase-order.module';
import { InventoryModule } from '../inventory/inventory.module';
import { AccountingModule } from '../accounting/accounting.module';
import { ShipmentsModule } from '../shipment/shipments.module';
import { CustomersModule } from '../customers/customer.module';
import { SuppliersModule } from '../supliers/suppliers.module';
import { EmployeeModule } from '../hr/employee.module';

@Module({
    imports: [
        SalesOrderModule,
        PurchaseOrderModule,
        InventoryModule,
        AccountingModule,
        ShipmentsModule,
        CustomersModule,
        SuppliersModule,
        EmployeeModule,
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }
