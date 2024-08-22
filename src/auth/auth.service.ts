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
import {LoginUserDto} from "./dto/login-user.dto";
import {SignUpUserDto} from "./dto/sign-up-user.dto";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {GetProfileImagePathDto} from "../file/dto/get-profile-image-path.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly fileService: FileService,
    ) {}

    /**
     * 로그인
     * 회원가입
     */

    // 로그인
    async loginUser(loginUserDto: LoginUserDto): Promise<User | null> {
        const { email, password } = loginUserDto;

        // 이메일로 사용자 조회
        const user = await this.userService.findByEmail(email);

        // 비밀번호 비교
        if (!user || user.password !== password) {
            throw new UnauthorizedException('invalid email or password');
        }

        // 프로필 이미지 경로 매핑
        user.profileImagePath = await this.getProfileImagePath(user.userId, user.fileId);

        // 비밀번호 제거한 후 반환
        delete user.password;
        return user;
    }

    // 회원가입
    async signUpUser(signUpUserDto: SignUpUserDto): Promise<User | null> {
        const { email, password, nickname, profileImagePath } = signUpUserDto;

        // 이메일 중복 체크
        const isExistEmail = await this.userService.checkEmail(email);
        if (isExistEmail) {
            throw new BadRequestException('already exist email');
        }

        // 계정 정보 생성
        const createUserDto: CreateUserDto = {
            email,
            password,
            nickname,
            profileImagePath,
        };
        const user = await this.userService.createUser(createUserDto);

        if (!user) {
            throw new InternalServerErrorException('failed create user');
        }

        // 비밀번호 제거한 후 반환
        delete user.password;
        return user;
    }

    // private methods

    // 프로필 이미지 경로 조회
    private async getProfileImagePath(userId: number, fileId: number): Promise<string> {
        const getProfileImagePathDto: GetProfileImagePathDto = {
            userId,
            fileId,
        }
        const getProfileImage = await this.fileService.getProfileImagePath(getProfileImagePathDto);

        if (!getProfileImage) {
            return '/public/image/profile/default.png';
        }

        return getProfileImage;
    }
}
