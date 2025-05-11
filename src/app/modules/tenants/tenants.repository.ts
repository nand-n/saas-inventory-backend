import { EntityRepository, Repository } from 'typeorm';
import { Tenant } from './entities/tenants.entity';

@EntityRepository(Tenant)
export class TenantRepository extends Repository<Tenant> {}
