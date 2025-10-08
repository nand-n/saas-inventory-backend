import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { SharedModule } from '../core/shared.module';
import { CoreModule } from './core.module';
import { AppConfigModule } from '../config/app.config.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
// import { APP_GUARD } from '@nestjs/core';
// import { TenantGuard } from '../core/guards/tenant.guar';
// import { AuthGuard } from '../core/guards/auth.guard';

/** This is a TypeScript module that imports various modules and sets up a TypeORM connection using
configuration values obtained from a ConfigService. */
@Module({
  imports: [
    AppConfigModule,
    CoreModule,
    SharedModule,
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: 'your_secret_key',
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
      
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'postgres'>('db.type'),
        host: configService.get<string>('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get<string>('db.user'),
        password: configService.get<string>('db.password'),
        database: configService.get<string>('db.name'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('db.synchronize'),
        // ssl: {
        //   rejectUnauthorized: false,
        // },
        ssl:true
      }),
      inject: [ConfigService],
    }),
    
    
  ],

  providers:[
    JwtService,
  ]
})
export class AppModule {}
