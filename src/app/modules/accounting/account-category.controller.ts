import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountCategoryService } from './account-category.service';
import { CreateAccountCategoryDto } from './dto/create-account-category.dto';
import { UpdateAccountCategoryDto } from './dto/update-chart-of-account.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AccountCategory } from './entities/account-category.entity';
import { AuthGuard } from '@root/src/core/guards/auth.guard';
import { RolesGuard } from '@root/src/core/guards/roles.guard';

@ApiTags('Account Categories')
@Controller('account-categories')
@UseGuards(AuthGuard, RolesGuard)
export class AccountCategoryController {
  constructor(private readonly service: AccountCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account category' })
  @ApiResponse({ status: 201, type: AccountCategory })
  create(@Request() req: any, @Body() dto: CreateAccountCategoryDto) {
    const tenantId = req.user.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID not found in request');
    }
    return this.service.create({ ...dto, tenantId });
  }

  @Get()
  @ApiOperation({ summary: 'Get all account categories for a tenant' })
  @ApiParam({ name: 'tenantId', required: true })
  @ApiResponse({ status: 200, type: [AccountCategory] })
  findAll(@Request() req: any) {
    const tenantId = req.user.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID not found in request');
    }
    return this.service.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one account category by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, type: AccountCategory })
  findOne(@Param('id') id: string, @Request() req: any) {
    const tenantId = req.user.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID not found in request');
    }
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an account category by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, type: AccountCategory })
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: UpdateAccountCategoryDto,
  ) {
    const tenantId = req.user.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID not found in request');
    }
    return this.service.update(id, { ...dto, tenantId });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an account category by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 204, description: 'Account category deleted' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
