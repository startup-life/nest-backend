import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from '../file/file.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetProfileImagePathDto } from '../file/dto/get-profile-image-path.dto';
import { CreateProfileImageDto } from '../file/dto/create-profile-image.dto';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly fileService: FileService,
    ) {}

    /**
     * 이메일 대치 조회
     * 계정 정보 생성
     * 유저 정보 가져오기
     * 회원 정보 수정
     * 비밀번호 변경
     * 회원 탈퇴
     * 이메일 중복 체크
     * 닉네임 중복 체크
     */

    // 이메일 대치 조회
    async findByEmail(email: string): Promise<User | undefined> {
        return await this.userRepository.findOne({
            where: { email, deletedAt: null },
            withDeleted: false,
            select: [
                'userId',
                'email',
                'password',
                'nickname',
                'fileId',
                'createdAt',
                'updatedAt',
                'deletedAt',
            ], // 비밀번호 포함
        });
    }

    // 계정 정보 생성
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { email, password, nickname, profileImagePath } = createUserDto;

        // 계정 정보 생성 및 저장
        const user = new User();
        user.email = email;
        user.password = password;
        user.nickname = nickname;
        await this.userRepository.save(user);

        // 프로필 이미지 경로가 있는 경우
        if (profileImagePath) {
            const profileImage = await this.createProfileImage(
                user.userId,
                profileImagePath,
            );
            user.fileId = profileImage.fileId;
            await this.userRepository.save(user);
        }

        // 비밀번호 제거한 후 반환
        delete user.password;
        return user;
    }

    // 유저 정보 가져오기
    async getUserById(userId: number): Promise<any> {
        const user = await this.userRepository.findOne({ where: { userId } });

        if (!user) {
            throw new NotFoundException('not found user');
        }

        if (user.fileId)
            user.profileImagePath = await this.getProfileImagePath(
                userId,
                user.fileId,
            );
        else user.profileImagePath = '/image/profile/default.jpg';

        delete user.password;
        return user;
    }

    // 회원 정보 수정
    async updateUser(
        userId: number,
        updateUserDto: UpdateUserDto,
    ): Promise<User> {
        const { nickname, profileImagePath } = updateUserDto;

        // 유저 정보 조회
        const user = await this.getUserById(userId);

        // 닉네임 수정
        if (nickname) {
            user.nickname = nickname;
        }

        // 프로필 이미지 경로가 없는 경우
        if (!profileImagePath) {
            // 프로필 이미지 삭제
            user.fileId = null;
        } else if (profileImagePath !== user.profileImagePath) {
            // 새로운 프로필 이미지 경로 저장
            const profileImage = await this.createProfileImage(
                user.userId,
                profileImagePath,
            );
            user.fileId = profileImage.fileId;
        }

        // 변경된 유저 정보 저장
        await this.userRepository.save(user);

        return await this.getUserById(userId);
    }

    // 비밀번호 변경
    async updatePassword(
        userId: number,
        updatePasswordDto: UpdatePasswordDto,
    ): Promise<any> {
        const { password } = updatePasswordDto;

        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // 비밀번호 변경
        const changePass = await this.userRepository.update(userId, {
            password: hashedPassword,
        });
        if (!changePass) throw new NotFoundException('not found user');

        return await this.getUserById(userId);
    }

    // 회원 탈퇴
    async softDeleteUser(userId: number): Promise<any> {
        const deleteUser = await this.userRepository.softDelete(userId);
        if (!deleteUser) throw new NotFoundException('not found user');

        return deleteUser;
    }

    // 이메일 중복 체크
    async checkEmail(email: string): Promise<boolean> {
        const user = await this.userRepository.findOne({
            where: { email },
            withDeleted: false,
        });
        return !!user;
    }

    // 닉네임 중복 체크
    async checkNickname(nickname: string): Promise<boolean> {
        const user = await this.userRepository.findOne({
            where: { nickname },
            withDeleted: false,
        });
        return !!user;
    }

    // private method

    private async getProfileImagePath(
        userId: number,
        fileId: number,
    ): Promise<any> {
        const getProfileImagePathDto: GetProfileImagePathDto = {
            userId,
            fileId,
        };
        return await this.fileService.getProfileImagePath(
            getProfileImagePathDto,
        );
    }

    private async createProfileImage(
        userId: number,
        filePath: string,
    ): Promise<any> {
        const createProfileImageDto: CreateProfileImageDto = {
            userId,
            filePath,
        };
        return await this.fileService.createProfileImage(createProfileImageDto);
    }
}
