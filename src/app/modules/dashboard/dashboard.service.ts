import { Injectable } from '@nestjs/common';
import { SalesOrderService } from '../sales-order/sales-order.service';
import { PurchaseOrderService } from '../purchase-order/purchase-order.service';
import { InventoryItemService } from '../inventory/inventory-item.service';
import { CustomersService } from '../customers/customers.service';
import { SuppliersService } from '../supliers/suppliers.service';
import { EmployeeService } from '../hr/employee.service';
import { ShipmentsService } from '../shipment/shipments.service';
import { JournalService } from '../accounting/journal.service';

@Injectable()
export class DashboardService {
    constructor(
        private readonly salesOrderService: SalesOrderService,
        private readonly purchaseOrderService: PurchaseOrderService,
        private readonly inventoryService: InventoryItemService,
        private readonly customersService: CustomersService,
        private readonly suppliersService: SuppliersService,
        private readonly employeeService: EmployeeService,
        private readonly shipmentsService: ShipmentsService,
        private readonly journalService: JournalService,
    ) { }

    async getSummary(startDate: string, endDate: string, branch: string) {
        const salesStats = await this.salesOrderService.getStats();
        const activeCustomers = await this.customersService.count();
        const inventoryCount = await this.inventoryService.count();
        const totalShipments = await this.shipmentsService.count();

        return {
            totalRevenue: salesStats.totalAmount,
            totalOrders: salesStats.totalOrders,
            activeCustomers,
            inventoryItems: inventoryCount,
            pendingOrders: salesStats.totalOrders - salesStats.completed,
            totalShipments,
        };
    }

    async getRecentActivities(limit: number = 10) {
        const sales = await this.salesOrderService.findAll();
        const purchases = await this.purchaseOrderService.findAll();

        const activities = [
            ...sales.slice(0, 5).map(so => ({
                description: `New Sales Order: ${so.soNumber}`,
                timestamp: (so as any).createdAt,
                user: 'System',
                type: 'Sales',
            })),
            ...purchases.slice(0, 5).map(po => ({
                description: `New Purchase Order: ${po.poNumber}`,
                timestamp: (po as any).createdAt,
                user: 'System',
                type: 'Purchase',
            })),
        ];

        return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
    }

    async getAlerts(branch: string) {
        return [
            {
                id: '1',
                title: 'System Active',
                message: 'Dashboard is now connected to live services.',
                type: 'info',
                timestamp: new Date().toISOString(),
            },
        ];
    }

    async getPerformanceMetrics(startDate: string, endDate: string, branch: string) {
        const salesStats = await this.salesOrderService.getStats();

        return {
            customerSatisfaction: 94,
            orderFulfillment: salesStats.totalOrders > 0 ? Math.round((salesStats.completed / salesStats.totalOrders) * 100) : 100,
            inventoryTurnover: 3.2,
        };
    }
}
