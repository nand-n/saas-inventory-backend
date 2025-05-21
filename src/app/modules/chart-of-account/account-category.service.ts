// import {
//   Injectable,
//   NotFoundException,
//   ConflictException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { AccountCategory } from './entities/account-category.entity';
// import {
//   CreateAccountCategoryDto,
//   UpdateAccountCategoryDto,
// } from './dto/account-category.dto';

// @Injectable()
// export class AccountCategoryService {
//   constructor(
//     @InjectRepository(AccountCategory)
//     private readonly categoryRepo: Repository<AccountCategory>,
//   ) {}

//   async create(dto: CreateAccountCategoryDto) {
//     const exists = await this.categoryRepo.findOneBy({ code: dto.code });
//     if (exists) {
//       throw new ConflictException('Category with this code already exists');
//     }
//     return this.categoryRepo.save(dto);
//   }

//   async findAll() {
//     return this.categoryRepo.find();
//   }

//   async findOne(id: string) {
//     const category = await this.categoryRepo.findOneBy({ id });
//     if (!category) throw new NotFoundException('Category not found');
//     return category;
//   }

//   async update(id: string, dto: UpdateAccountCategoryDto) {
//     const category = await this.findOne(id);
//     return this.categoryRepo.save({ ...category, ...dto });
//   }

//   async remove(id: string) {
//     const category = await this.findOne(id);
//     return this.categoryRepo.delete(category.id);
//   }
// }
