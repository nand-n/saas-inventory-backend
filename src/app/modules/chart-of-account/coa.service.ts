import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChartOfAccount } from './entities/chart-of-account.entity';
import { AccountCategory } from './entities/account-category.entity';
import { CreateCoaDto, UpdateCoaDto } from './dto/coa.dto';

@Injectable()
export class CoaService {
  constructor(
    @InjectRepository(ChartOfAccount)
    private coaRepo: Repository<ChartOfAccount>,
    @InjectRepository(AccountCategory)
    private categoryRepo: Repository<AccountCategory>,
  ) {}

  async createAccount(createDto: CreateCoaDto) {
    const category = await this.categoryRepo.findOneBy({
      id: createDto.categoryId,
    });
    if (!category) throw new NotFoundException('Category not found');

    return this.coaRepo.save({
      ...createDto,
      category,
    });
  }

  async getAllAccounts(categoryId?: string) {
    const filter = categoryId
      ? { where: { category: { id: categoryId } } }
      : {};
    return this.coaRepo.find({
      ...filter,
      relations: ['category'],
    });
  }
  async getAccountById(id: string) {
    const account = await this.coaRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!account) throw new NotFoundException('Account not found');
    return account;
  }
  async updateAccount(id: string, updateDto: UpdateCoaDto) {
    const account = await this.getAccountById(id);
    const category = await this.categoryRepo.findOneBy({
      id: updateDto.categoryId,
    });
    if (!category) throw new NotFoundException('Category not found');

    return this.coaRepo.save({
      ...account,
      ...updateDto,
      category,
    });
  }
  async deleteAccount(id: string) {
    const account = await this.getAccountById(id);
    return this.coaRepo.softDelete(account);
  }
  async getAccountByCode(code: string) {
    const account = await this.coaRepo.findOne({
      where: { code },
      relations: ['category'],
    });
    if (!account) throw new NotFoundException('Account not found');
    return account;
  }
}
