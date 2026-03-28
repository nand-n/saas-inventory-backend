import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('summary')
    getSummary(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Query('branch') branch: string,
    ) {
        return this.dashboardService.getSummary(startDate, endDate, branch);
    }

    @Get('recent-activities')
    getRecentActivities(@Query('limit') limit: number) {
        return this.dashboardService.getRecentActivities(limit);
    }

    @Get('alerts')
    getAlerts(@Query('branch') branch: string) {
        return this.dashboardService.getAlerts(branch);
    }

    @Get('performance-metrics')
    getPerformanceMetrics(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Query('branch') branch: string,
    ) {
        return this.dashboardService.getPerformanceMetrics(startDate, endDate, branch);
    }
}
