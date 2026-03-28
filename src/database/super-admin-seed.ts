import { DataSource } from 'typeorm';
import { dataSourceOptions } from './migration-data-source';
import { User } from '../app/modules/users/entities/user.entity';
import { UserRole } from '../app/modules/users/enums/user.enum';
import * as crypto from 'crypto';

function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
        .toString('hex');
    return `${salt}:${hash}`;
}

async function seed() {
    const dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();
    console.log('Data Source has been initialized!');

    const userRepo = dataSource.getRepository(User);

    const adminEmail = process.env.SUPERADMIN_EMAIL || 'admin@admin.com';
    const adminPassword = process.env.SUPERADMIN_PASSWORD || 'admin123';

    // Check if any superadmin already exists
    // Using a query builder or raw check is more reliable for simple-array
    const existingSuperAdmin = await userRepo.createQueryBuilder('user')
        .where('user.roles LIKE :role', { role: `%${UserRole.SUPER_ADMIN}%` })
        .getOne();

    if (existingSuperAdmin) {
        console.log(`SuperAdmin already exists: ${existingSuperAdmin.email}`);
    } else {
        // Double check by email too
        const existingByEmail = await userRepo.findOne({ where: { email: adminEmail } });

        if (existingByEmail) {
            console.log(`User with email ${adminEmail} already exists. Skipping creation to avoid conflicts.`);
        } else {
            const adminUser = userRepo.create({
                firstName: 'System',
                lastName: 'Admin',
                email: adminEmail,
                password: hashPassword(adminPassword),
                phone: '0000000000',
                roles: [UserRole.SUPER_ADMIN],
            });

            await userRepo.save(adminUser);
            console.log(`Successfully seeded SuperAdmin: ${adminEmail}`);
        }
    }

    await dataSource.destroy();
    console.log('Seeding process finished.');
}

seed().catch((error) => {
    console.error('Error during seeding:', error);
    process.exit(1);
});
