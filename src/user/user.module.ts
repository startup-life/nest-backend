import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import {FileModule} from "../file/file.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        FileModule
    ],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
