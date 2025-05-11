import { Controller, Get, Param } from '@nestjs/common';
import { BranchInventoryService } from './branch-inventory.service';

@Controller('tenant-inventory/:tenantid')
export class TenantInventoryController {
  constructor(private readonly branchInventoryService: BranchInventoryService) {}

  @Get()
  async findAll(@Param('tenantid') tenantId: string) {
    return await this.branchInventoryService.findAllWithTenantId(tenantId);
  }
}
