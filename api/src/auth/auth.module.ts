import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAuthGuard } from './guards/jwt-guard';
import { RolesGuard } from './guards/roles-guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET'),
            signOptions: { expiresIn: '3600s' }
        })
    }), forwardRef(() => UserModule)],
    providers: [AuthService, LocalStrategy, JwtAuthGuard, RolesGuard, JwtStrategy],
    exports: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {}
