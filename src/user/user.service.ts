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
    }

    async checkEmail(email: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { email } });
        return !!user;
    }

    async checkNickname(nickname: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { nickname } });
        return !!user;
    }

    async getUser(userId: number): Promise<User> {
        const user = await this.userRepository.findOne({where: {userId}});

        if (user.fileId) {
            user.profileImagePath = await this.fileService.getProfileImagePath(userId, user.fileId);
        }

        delete user.password;
        return user;
    }

    async updateUser(requestBody: {parsedUserId: number, nickname: string, profileImagePath: string}): Promise<User> {
        const { parsedUserId, nickname, profileImagePath } = requestBody;

        const user = await this.getUser(parsedUserId);

        if (!user) {
            return null;
        }

        user.nickname = nickname;

        // 프로필 이미지 경로가 없는 경우
        if (profileImagePath === user.profileImagePath) {
            // 기존 유저 정보 저장
            const savedUser = await this.userRepository.save(user);
            delete savedUser.password;  // 패스워드 제거
            return savedUser;
        }

        if (!profileImagePath) {
            // 프로필 이미지 삭제
            user.fileId = null;
            await this.userRepository.save(user);
            return await this.getUser(parsedUserId);

        }

        const profileImage = await this.fileService.createProfileImage(parsedUserId, profileImagePath);
        user.fileId = profileImage.fileId;
        await this.userRepository.save(user);

        return await this.getUser(parsedUserId);
    }

    async updatePassword(requestBody: {parsedUserId: number, password: string}): Promise<User> {
        const { parsedUserId, password } = requestBody;

        const user = await this.getUser(parsedUserId);

        if (!user) {
            return null;
        }

        user.password = password;
        await this.userRepository.save(user);

        delete user.password;
        return user;
    }

    async softDeleteUser(userId: number): Promise<User> {
        const user = await this.getUser(userId);

        if (!user) {
            return null;
        }

        user.deletedAt = new Date();
        await this.userRepository.save(user);

        delete user.password;
        return user;
    }
}
