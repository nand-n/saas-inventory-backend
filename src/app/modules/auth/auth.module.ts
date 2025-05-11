import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RolesGuard } from '@root/src/core/guards/roles.guard';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
    imports: [UsersModule, 
    // PassportModule,
    JwtModule.register({
        secret: 'your_secret_key',
        signOptions: { expiresIn: '1d' },
      }),

]
    
    ,
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy , LocalStrategy, RolesGuard],
})
export class AuthModule {}
