import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateAccountCategoryDto,
  UpdateAccountCategoryDto,
} from './dto/account-category.dto';
import { AccountCategoryService } from './account-category.service';

@ApiTags('Account Categories')
@Controller('account-categories')
export class AccountCategoryController {
  constructor(private readonly categoryService: AccountCategoryService) {}

  @Post()
  create(@Body() dto: CreateAccountCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAccountCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
