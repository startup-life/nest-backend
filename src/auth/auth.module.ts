import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { FileModule } from '../file/file.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, File]), // User 및 File 엔티티를 포함
        UserModule,
        FileModule
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
