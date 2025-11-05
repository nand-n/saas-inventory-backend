import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RfiService } from './rfi.service';
import { CreateRfiDto } from './dtos/create-rfi.dto';
import { UpdateRfiDto } from './dtos/update-rfi.dto';

@ApiTags('RFIs')
@Controller('rfis')
export class RfiController {
  constructor(private readonly rfiService: RfiService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new RFI document' })
  @ApiResponse({ status: 201, description: 'RFI successfully created' })
  create(@Body() createRfiDto: CreateRfiDto) {
    return this.rfiService.create(createRfiDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all RFIs' })
  @ApiResponse({ status: 200, description: 'List of RFIs returned' })
  findAll() {
    return this.rfiService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single RFI by ID' })
  @ApiResponse({ status: 200, description: 'RFI found' })
  findOne(@Param('id') id: string) {
    return this.rfiService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing RFI' })
  @ApiResponse({ status: 200, description: 'RFI updated successfully' })
  update(@Param('id') id: string, @Body() updateRfiDto: UpdateRfiDto) {
    return this.rfiService.update(id, updateRfiDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an RFI' })
  @ApiResponse({ status: 200, description: 'RFI deleted successfully' })
  remove(@Param('id') id: string) {
    return this.rfiService.remove(id);
  }
}
