import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JournalService, FinancialSummary } from './journal.service';
import { CreateJournalDto } from './dto/create-journal.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Journal } from './entities/journal.entity';
import { AuthGuard } from '@root/src/core/guards/auth.guard';
import { RolesGuard } from '@root/src/core/guards/roles.guard';

@ApiTags('Journals')
@Controller('journals')
@UseGuards(AuthGuard, RolesGuard)
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new journal entry' })
  @ApiResponse({ status: 201, description: 'Journal created', type: Journal })
  async create(@Body() createJournalDto: CreateJournalDto): Promise<Journal> {
    return this.journalService.create(createJournalDto);
  }
  @Get('summary')
  async getSummary(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    const tenantId = req.user.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID not found in request');
    }

    return this.journalService.getFinancialSummary(
      tenantId,
      startDate,
      endDate,
    );
  }

  @Get(':tenantId')
  @ApiOperation({ summary: 'Get all journals for a tenant' })
  @ApiParam({ name: 'tenantId', required: true })
  @ApiResponse({
    status: 200,
    description: 'List of journals',
    type: [Journal],
  })
  async findAll(@Param('tenantId') tenantId: string): Promise<Journal[]> {
    return this.journalService.findAll(tenantId);
  }

  @Get(':tenantId/:id')
  @ApiOperation({ summary: 'Get a journal by ID and tenant' })
  @ApiParam({ name: 'tenantId', required: true })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Journal found', type: Journal })
  async findOne(
    @Param('id') id: string,
    @Param('tenantId') tenantId: string,
  ): Promise<Journal> {
    return this.journalService.findOne(id, tenantId);
  }

  @Delete(':tenantId/:id')
  @ApiOperation({ summary: 'Delete a journal by ID and tenant' })
  @ApiParam({ name: 'tenantId', required: true })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 204, description: 'Journal deleted' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Param('tenantId') tenantId: string,
  ): Promise<void> {
    await this.journalService.remove(id, tenantId);
  }
}
