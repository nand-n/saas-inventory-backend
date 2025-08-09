import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { ChartOfAccountService } from './chart-of-account.service';
import { CreateChartOfAccountDto } from './dto/create-chart-of-account.dto';
// import { UpdateChartOfAccountDto } from './dto/update-account-category.dto';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@root/src/core/guards/auth.guard';
import { RolesGuard } from '@root/src/core/guards/roles.guard';
import { Roles } from '@root/src/core/decorators/roles.decorator';

@ApiTags('Chart of Accounts')
@UseGuards(AuthGuard, RolesGuard)
@Controller('chart-of-accounts')
export class ChartOfAccountController {
  constructor(private readonly chartOfAccountService: ChartOfAccountService) {}

  @Post()
  @ApiOperation({ summary: 'Create a chart of account' })
  async create(@Request() req: any, @Body() dto: CreateChartOfAccountDto) {
    const tenantId = req.user.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID not found in request');
    }
    return this.chartOfAccountService.create({ ...dto, tenantId });
  }

  @Post('bulk')
@ApiOperation({ summary: 'Create multiple chart of accounts' })
async bulkCreate(
  @Request() req: any,
  @Body() dtos: CreateChartOfAccountDto[],
) {
  const tenantId = req.user.tenantId;
  if (!tenantId) {
    throw new UnauthorizedException('Tenant ID not found in request');
  }
  return this.chartOfAccountService.bulkCreate(
    dtos.map((dto) => ({ ...dto, tenantId })),
  );
}

  @Get()
  @ApiOperation({ summary: 'Get all chart of accounts for a tenant' })
  async findAll(@Request() req: any) {
    const tenantId = req.user.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID not found in request');
    }
    return this.chartOfAccountService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific chart of account by ID and tenant' })
  @ApiParam({ name: 'id', description: 'Chart of Account ID' })
  @ApiQuery({ name: 'tenantId', required: true })
  async findOne(@Param('id') id: string, @Request() req: any) {
    const tenantId = req.user.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID not found in request');
    }
    return this.chartOfAccountService.findOne(id, tenantId);
  }

  // Uncomment this block when the update method is ready in service
  // @Patch(':id')
  // @ApiOperation({ summary: 'Update a chart of account' })
  // @ApiParam({ name: 'id', description: 'Chart of Account ID' })
  // @ApiQuery({ name: 'tenantId', required: true })
  // async update(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Query('tenantId', ParseUUIDPipe) tenantId: string,
  //   @Body() dto: UpdateChartOfAccountDto,
  // ) {
  //   return this.chartOfAccountService.update(id, tenantId, dto);
  // }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chart of account by ID and tenant' })
  @ApiParam({ name: 'id', description: 'Chart of Account ID' })
  async remove(@Param('id') id: string, @Request() req: any) {
    const tenantId = req.user.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID not found in request');
    }
    return this.chartOfAccountService.remove(id, tenantId);
  }
}
