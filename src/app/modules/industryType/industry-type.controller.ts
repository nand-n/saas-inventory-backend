import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { IndustryTypeService } from './industry-type.service';
import { CreateIndustryTypeDto } from './dto/create-industry-type.dto';
import { UpdateIndustryTypeDto } from './dto/update-industry-type.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Industry Type")
@Controller('industry-type')
export class IndustryTypeController {
    constructor(private readonly industryTypeService: IndustryTypeService) {}

    @Post()
    create(@Body() createIndustryTypeDto: CreateIndustryTypeDto) {
        return this.industryTypeService.create(createIndustryTypeDto);
    }

    @Get()
    findAll() {
        return this.industryTypeService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.industryTypeService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateIndustryTypeDto: UpdateIndustryTypeDto) {
        return this.industryTypeService.update(id, updateIndustryTypeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.industryTypeService.remove(id);
    }
}