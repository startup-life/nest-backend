import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { FileModule } from '../file/file.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/user.entity";
import {File} from "../file/file.entity";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import {JwtModule} from "@nestjs/jwt";
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, File]), // User 및 File 엔티티를 포함
        UserModule,
        FileModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1h' },
            }),
        }),
    ],
    providers: [
        AuthService,
        JwtStrategy,
    ],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
