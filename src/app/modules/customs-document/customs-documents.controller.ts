import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CustomsDocumentsService } from './customs-documents.service';
import { CreateCustomsDocumentDto } from './dto/create-customs-document.dto';
import { CustomsDocument } from './entities/customs-document.entity';
import { UpdateCustomsDocumentDto } from './dto/update-customs-document.dto';

@Controller('customs-documents')
export class CustomsDocumentsController {
  constructor(private readonly service: CustomsDocumentsService) {}

  @Post()
  create(@Body() dto: CreateCustomsDocumentDto): Promise<CustomsDocument> {
    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<CustomsDocument[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CustomsDocument> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomsDocumentDto,
  ): Promise<CustomsDocument> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
