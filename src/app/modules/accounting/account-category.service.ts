import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountCategory } from './entities/account-category.entity';
import { CreateAccountCategoryDto } from './dto/create-account-category.dto';
import { UpdateAccountCategoryDto } from './dto/update-chart-of-account.dto';

@Injectable()
export class AccountCategoryService {
  constructor(
    @InjectRepository(AccountCategory)
    private repo: Repository<AccountCategory>,
  ) {}
  async create(dto: CreateAccountCategoryDto) {
    const existing = await this.repo.findOne({
      where: {
        code: dto.code,
        tenant: { id: dto.tenantId },
      },
    });
    if (existing) {
      throw new BadRequestException(
        `Account Category with code '${dto.code}' already exists for this tenant`,
      );
    }
    const entity = this.repo.create({ ...dto, tenant: { id: dto.tenantId } });
    return this.repo.save(entity);
  }
  findAll(tenantId: string) {
    return this.repo.find({ where: { tenant: { id: tenantId } } });
  }
  async findOne(id: string) {
    const cat = await this.repo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException();
    return cat;
  }
  async update(id: string, dto: UpdateAccountCategoryDto) {
    await this.repo.update(id, dto);
    return await this.findOne(id);
  }
  remove(id: string) {
    return this.repo.delete(id);
  }
}
