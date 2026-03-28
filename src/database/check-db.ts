import { DataSource } from 'typeorm';
import { dataSourceOptions } from './migration-data-source';
import { User } from '../app/modules/users/entities/user.entity';
import { Tenant } from '../app/modules/tenants/entities/tenants.entity';

async function check() {
    const dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    const userRepo = dataSource.getRepository(User);
    const tenantRepo = dataSource.getRepository(Tenant);

    const userCount = await userRepo.count();
    const tenantCount = await tenantRepo.count();
    const superAdminCount = await userRepo.createQueryBuilder('user')
        .where('user.roles LIKE :role', { role: '%super_admin%' })
        .getCount();

    console.log(`Users: ${userCount}`);
    console.log(`Tenants: ${tenantCount}`);
    console.log(`SuperAdmins: ${superAdminCount}`);

    if (userCount > 0) {
        const users = await userRepo.find({ take: 5 });
        console.log('Sample Users:', users.map(u => ({ email: u.email, roles: u.roles })));
    }

    await dataSource.destroy();
}

check().catch(console.error);
