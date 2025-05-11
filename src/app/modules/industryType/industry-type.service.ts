import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIndustryTypeDto } from './dto/create-industry-type.dto';
import { UpdateIndustryTypeDto } from './dto/update-industry-type.dto';
import { IndustryType } from './entitities/industryType.entity';

@Injectable()
export class IndustryTypeService {
  constructor(
    @InjectRepository(IndustryType)
    private industryTypeRepository: Repository<IndustryType>,
  ) {}

  async create(
    createIndustryTypeDto: CreateIndustryTypeDto,
  ): Promise<IndustryType> {
    const existingIndustryType = await this.industryTypeRepository.findOne({
      where: { name: createIndustryTypeDto.name },
    });

    if (existingIndustryType) {
      throw new ConflictException(
        'Industry type with this name already exists for the tenant',
      );
    }

    const industryType = this.industryTypeRepository.create(
      createIndustryTypeDto,
    );
    return this.industryTypeRepository.save(industryType);
  }

  async findAll(): Promise<IndustryType[]> {
    return this.industryTypeRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<IndustryType> {
    const industryType = await this.industryTypeRepository.findOne({
      where: { id },
    });

    if (!industryType) {
      throw new NotFoundException('Industry type not found');
    }

    return industryType;
  }

  async update(
    id: string,
    updateIndustryTypeDto: UpdateIndustryTypeDto,
  ): Promise<IndustryType> {
    const industryType = await this.findOne(id);
    return this.industryTypeRepository.save({
      ...industryType,
      ...updateIndustryTypeDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.industryTypeRepository.delete(id);
  }
}
