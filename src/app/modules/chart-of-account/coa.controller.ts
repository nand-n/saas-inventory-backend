// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Post,
//   Put,
//   Query,
// } from '@nestjs/common';
// import { CreateCoaDto, UpdateCoaDto } from './dto/coa.dto';
// import { CoaService } from './coa.service';
// import { ApiTags } from '@nestjs/swagger';

// @ApiTags('Chart of Account')
// @Controller('coa')
// export class CoaController {
//   constructor(private readonly coaService: CoaService) {}

//   @Post()
//   create(@Body() createDto: CreateCoaDto) {
//     return this.coaService.createAccount(createDto);
//   }

//   @Get()
//   findAll(@Query('categoryId') categoryId?: string) {
//     return this.coaService.getAllAccounts(categoryId);
//   }

//   @Get('id/:id')
//   findOneById(@Param('id') id: string) {
//     return this.coaService.getAccountById(id);
//   }

//   @Get('code/:code')
//   findByCode(@Param('code') code: string) {
//     return this.coaService.getAccountByCode(code);
//   }

//   @Put(':id')
//   update(@Param('id') id: string, @Body() updateDto: UpdateCoaDto) {
//     return this.coaService.updateAccount(id, updateDto);
//   }

//   @Delete(':id')
//   delete(@Param('id') id: string) {
//     return this.coaService.deleteAccount(id);
//   }
// }
