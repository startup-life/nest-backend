import { Injectable } from '@nestjs/common';
import {User} from "./user.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findByEmail(email: string): Promise<User | undefined> {
        return await this.userRepository.findOne({
            where: { email, deletedAt: null },
            select: ['userId', 'email', 'password', 'nickname', 'fileId', 'createdAt', 'updatedAt', 'deletedAt'], // 비밀번호 포함
        });
    }

    async updateProfileImage(userId: number, profileImagePath: string): Promise<void> {
        await this.userRepository.update(userId, { profileImagePath });
    }
}
