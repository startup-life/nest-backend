import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { FileService } from '../file/file.service';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly fileService: FileService,
    ) {}

    async loginUser(email: string, password: string): Promise<User | null> {
        const user = await this.userService.findByEmail(email);

        if (!user || user.password !== password) {  // 비밀번호 비교
            return null;
        }

        user.profileImagePath = await this.fileService.getProfileImagePath(user.userId, user.fileId);

        // 비밀번호는 제거한 후 반환
        delete user.password;

        return user;
    }

    async signUpUser(email: string, password: string, nickname: string, profileImagePath:string): Promise<User | null> {
        const isExistEmail = await this.userService.checkEmail(email);

        if (isExistEmail) {
            return null;
        }

        const user = await this.userService.createUser(email, password, nickname, profileImagePath);

        if (!user) {
            return null;
        }

        return user;
    }
}
