import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { CreateInteractionDto } from './dtos/create-interaction.dto';

@Controller('crm/interactions')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Post()
  create(@Body() dto: CreateInteractionDto) {
    return this.interactionService.create(dto);
  }

  @Get()
  findAll() {
    return this.interactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interactionService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interactionService.remove(id);
  }
}
