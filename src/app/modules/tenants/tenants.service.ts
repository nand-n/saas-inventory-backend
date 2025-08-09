import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenants.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { IndustryTypeService } from '../industryType/industry-type.service';
import { UsersService } from '../users/users.service';
import { SubscriptionPlan } from '../subscription-plan/entities/subscription-plan.entity';
import { BranchesService } from '../branchs/branches.service';
import * as crypto from 'crypto';
import { UserRole } from '../users/enums/user.enum';


@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    private industryTypeService: IndustryTypeService,
    private usersService: UsersService,
    private branchsService: BranchesService

  ) {}

    private hashPassword(password: string): string {
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
        .toString('hex');
      return `${salt}:${hash}`;
    }
  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const existingTenant = await this.tenantRepository.findOne({
      where: { name: createTenantDto.name }
    });

    if (existingTenant) {
      throw new ConflictException('Tenant with this name already exists');
    }


    const hashedPassword = this.hashPassword('123456');

    const adminUser = await this.usersService.create({
      firstName: createTenantDto.tenantAdmin.firstName,
      lastName: createTenantDto.tenantAdmin.lastName,
      email: createTenantDto.tenantAdmin.email,
      phone: createTenantDto.tenantAdmin.phone,
      password: hashedPassword,
      roles: [UserRole.TENANT_ADMIN],
    
    });

    const industryType = await this.industryTypeService.findOne(createTenantDto.industryType);
    if(!industryType){
      throw new NotFoundException('Industry type not found');
    }
    const tenant = this.tenantRepository.create({
      name: createTenantDto.name,
      numberOfBranches: createTenantDto.numberOfBranches,
      industryType,
      contactEmail: createTenantDto.tenantAdmin.email,
      users: [adminUser],
      isActive: createTenantDto.isActive ?? true,
    });


    const createdTenant = await this.tenantRepository.save(tenant);
    await this.branchsService.createDefaultBranchs(createTenantDto.numberOfBranches , createdTenant.id)

    return createdTenant
  }

  async findAll(): Promise<Tenant[]> {
  return this.tenantRepository
    .createQueryBuilder('tenant')
    .leftJoinAndSelect('tenant.industryType', 'industryType')
    .leftJoinAndSelect('tenant.branches', 'branches')
    .leftJoinAndSelect('tenant.configurations', 'configurations')
    .leftJoinAndSelect('tenant.currentSubscriptionPlan', 'currentSubscriptionPlan')
    .leftJoin('tenant.users', 'users')
    .addSelect(['users.id', 'users.firstName', 'users.lastName', 'users.email' , 'users.phone' , 'users.roles'])
    .getMany();
}


  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({ where: { id }, relations: ['industryType', 'branches' , 'configurations', "currentSubscriptionPlan"] });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOne(id);
    const industryType = updateTenantDto.industryType
      ? await this.industryTypeService.findOne(updateTenantDto.industryType)
      : tenant.industryType;

    return this.tenantRepository.save({
      ...tenant,
      ...updateTenantDto,
      industryType,
    });
  } 

  async deactivate(id: string): Promise<Tenant> {
    const tenant = await this.findOne(id);
    tenant.isActive = false;
    return this.tenantRepository.save(tenant);
  }

  async attachSubscriptionToTenant(
    subscriptionPlan: SubscriptionPlan,
  ): Promise<Tenant> {
    // Find the tenant using the subscription's tenant_id
    const tenant = await this.tenantRepository.findOne({
      where: { id: subscriptionPlan.tenant_id },
    });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    // Update the tenant's current subscription
    tenant.currentSubscriptionPlan = subscriptionPlan;

    // Save the updated tenant
    const updatedTenant = await this.tenantRepository.save(tenant);
    return updatedTenant;
  }
}