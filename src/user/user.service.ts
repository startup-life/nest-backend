import { Injectable } from '@nestjs/common';
import {User} from "./user.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {FileService} from "../file/file.service";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly fileService: FileService,
    ) {}

    async findByEmail(email: string): Promise<User | undefined> {
        return await this.userRepository.findOne({
            where: { email, deletedAt: null },
            select: ['userId', 'email', 'password', 'nickname', 'fileId', 'createdAt', 'updatedAt', 'deletedAt'], // 비밀번호 포함
        });
    }

    async createUser(email: string, password: string, nickname: string, profileImagePath: string): Promise<User> {
        const user = new User();
        user.email = email;
        user.password = password;
        user.nickname = nickname;
        await this.userRepository.save(user);

        if (profileImagePath) {
            const profileImage = await this.fileService.createProfileImage(user.userId, profileImagePath);
            user.fileId = profileImage.fileId;
            await this.userRepository.save(user);
        }

        delete user.password;
        return user;
    };

    async checkEmail(email: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { email } });
        return !!user;
    }


}
