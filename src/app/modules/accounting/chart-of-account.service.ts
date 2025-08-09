import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In, DeepPartial } from 'typeorm';
import { ChartOfAccount } from './entities/chart-of-account.entity';
import { AccountCategory } from './entities/account-category.entity';
import { CreateChartOfAccountDto } from './dto/create-chart-of-account.dto';
import { Tenant } from '../tenants/entities/tenants.entity';
import { UpdateChartOfAccountDto } from './dto/update-account-category.dto';

@Injectable()
export class ChartOfAccountService {
  constructor(
    @InjectRepository(ChartOfAccount)
    private coaRepo: Repository<ChartOfAccount>,
    @InjectRepository(AccountCategory)
    private categoryRepo: Repository<AccountCategory>,
    @InjectRepository(Tenant)
    private tenantRepo: Repository<Tenant>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateChartOfAccountDto): Promise<ChartOfAccount> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tenant = await this.tenantRepo.findOneBy({ id: dto.tenantId });
      if (!tenant)
        throw new NotFoundException(`Tenant ${dto.tenantId} not found`);

      const category = await this.categoryRepo.findOne({
        where: { id: dto.categoryId, tenant: { id: dto.tenantId } },
      });
      if (!category)
        throw new NotFoundException(`Category ${dto.categoryId} not found`);

      const existing = await this.coaRepo.findOne({
        where: {
          name: dto.name,
          tenant: { id: dto.tenantId },
        },
      });
      if (existing) {
        throw new BadRequestException(
          `Chart of Account with name '${dto.name}' already exists for this tenant`,
        );
      }
      let parent: ChartOfAccount | null = null;
      if (dto.parentId) {
        parent = await this.coaRepo.findOne({
          where: { id: dto.parentId, tenant: { id: dto.tenantId } },
          relations: ['children'],
        });
        if (!parent)
          throw new NotFoundException(`Parent ${dto.parentId} not found`);

        if (parent.isLeaf) {
          parent.isLeaf = false;
          await queryRunner.manager.save(parent);
        }
      }

      const { tenantId, categoryId, parentId, ...rest } = dto;

      const payload: Partial<ChartOfAccount> = {
        ...rest,
        tenant,
        category,

        ...(parent ? { parent } : {}),
      };

      const newAccount = this.coaRepo.create(payload);

      const saved = await queryRunner.manager.save(newAccount);
      await queryRunner.commitTransaction();
      return saved;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async bulkCreate(
  dtos: CreateChartOfAccountDto[],
): Promise<ChartOfAccount[]> {
  if (!dtos.length) {
    throw new BadRequestException('No payloads provided');
  }

  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const tenantId = dtos[0].tenantId;

    const tenant = await this.tenantRepo.findOneBy({ id: tenantId });
    if (!tenant) {
      throw new NotFoundException(`Tenant ${tenantId} not found`);
    }

    const result: ChartOfAccount[] = [];

    for (const dto of dtos) {
      // Validate category
      const category = await this.categoryRepo.findOne({
        where: { id: dto.categoryId, tenant: { id: tenantId } },
      });
      if (!category) {
        throw new NotFoundException(
          `Category ${dto.categoryId} not found`,
        );
      }

      // Check duplicate by name
      const existing = await this.coaRepo.findOne({
        where: {
          name: dto.name,
          tenant: { id: tenantId },
        },
      });
      if (existing) {
        throw new BadRequestException(
          `Chart of Account with name '${dto.name}' already exists for this tenant`,
        );
      }

      // Parent check
      let parent: ChartOfAccount | null = null;
      if (dto.parentId) {
        parent = await this.coaRepo.findOne({
          where: { id: dto.parentId, tenant: { id: tenantId } },
          relations: ['children'],
        });
        if (!parent) {
          throw new NotFoundException(
            `Parent ${dto.parentId} not found`,
          );
        }
        if (parent.isLeaf) {
          parent.isLeaf = false;
          await queryRunner.manager.save(parent);
        }
      }

      const { tenantId: _, categoryId, parentId, ...rest } = dto;

      const payload: Partial<ChartOfAccount> = {
        ...rest,
        tenant,
        category,
        ...(parent ? { parent } : {}),
      };

      const newAccount = this.coaRepo.create(payload);
      const saved = await queryRunner.manager.save(newAccount);

      result.push(saved);
    }

    await queryRunner.commitTransaction();
    return result;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}


  async findAll(tenantId: string): Promise<ChartOfAccount[]> {
    return this.coaRepo.find({
      where: { tenant: { id: tenantId } },
      relations: ['category', 'parent', 'children'],
    });
  }

  async findOne(id: string, tenantId: string): Promise<ChartOfAccount> {
    const account = await this.coaRepo.findOne({
      where: { id, tenant: { id: tenantId } },
      relations: ['category', 'parent', 'children', 'tenant'],
    });

    if (!account) {
      throw new NotFoundException(
        `Account ${id} not found in tenant ${tenantId}`,
      );
    }
    return account;
  }

  //   async update(
  //     id: string,
  //     tenantId: string,
  //     dto: UpdateChartOfAccountDto,
  //   ): Promise<ChartOfAccount> {
  //     const existing = await this.findOne(id, tenantId);

  //     if (existing.readOnly) {
  //       throw new BadRequestException('Read-only account cannot be modified');
  //     }

  //     // Validate code uniqueness if changing code
  //     if (dto.code && dto.code !== existing.code) {
  //       const codeExists = await this.coaRepo.findOne({
  //         where: { tenant: { id: tenantId }, code: dto.code },
  //       });
  //       if (codeExists) {
  //         throw new ConflictException(
  //           `Code ${dto.code} already exists in tenant`,
  //         );
  //       }
  //     }

  //     // Handle parent changes
  //     if (dto.parentId !== undefined) {
  //       if (dto.parentId === null) {
  //         // Removing parent
  //         existing.parent = null;
  //       } else if (dto.parentId !== existing.parent?.id) {
  //         // Changing parent
  //         const newParent = await this.coaRepo.findOne({
  //           where: { id: dto.parentId, tenant: { id: tenantId } },
  //           relations: ['children'],
  //         });

  //         if (!newParent) {
  //           throw new NotFoundException(`New parent ${dto.parentId} not found`);
  //         }

  //         if (newParent.isLeaf) {
  //           newParent.isLeaf = false;
  //           await this.coaRepo.save(newParent);
  //         }

  //         existing.parent = newParent;
  //       }
  //     }

  //     // Update other fields
  //     const updated = this.coaRepo.merge(existing, dto);
  //     await this.coaRepo.save(updated);

  //     return this.findOne(id, tenantId);
  //   }

  async remove(id: string, tenantId: string): Promise<void> {
    const account = await this.findOne(id, tenantId);

    if (account.readOnly) {
      throw new BadRequestException('Read-only account cannot be deleted');
    }

    if (account.children?.length > 0) {
      throw new ConflictException('Cannot delete account with child accounts');
    }

    // Check if parent needs to be updated
    if (account.parent) {
      const parent = await this.coaRepo.findOne({
        where: { id: account.parent.id },
        relations: ['children'],
      });

      if (parent && parent.children.length === 1) {
        parent.isLeaf = true;
        await this.coaRepo.save(parent);
      }
    }

    const result = await this.coaRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Account ${id} not found`);
    }
  }
}
