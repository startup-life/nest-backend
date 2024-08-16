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

        if (user.fileId) {
            const profileImagePath = await this.fileService.getProfileImagePath(user.fileId);
            await this.userService.updateProfileImage(user.userId, profileImagePath);
            user.profileImagePath = profileImagePath;
        } else {
            user.profileImagePath = '/public/image/profile/default.png';
        }

        return user;
    }
}
