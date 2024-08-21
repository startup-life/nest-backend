import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
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
            throw new UnauthorizedException('invalid email or password');
        }

        user.profileImagePath = await this.fileService.getProfileImagePath(user.userId, user.fileId);

        // 비밀번호는 제거한 후 반환
        delete user.password;
        return user;
    }

    async signUpUser(
        requestBody: {
            email: string,
            password: string,
            nickname: string,
            profileImagePath?:string
        }
    ): Promise<User | null> {
        const { email, password, nickname, profileImagePath } = requestBody;

        const isExistEmail = await this.userService.checkEmail(email);

        if (isExistEmail) {
            throw new BadRequestException('already exist email');
        }

        const user = await this.userService.createUser(email, password, nickname, profileImagePath);

        if (!user) {
            throw new InternalServerErrorException('failed create user');
        }

        return user;
    }
}
