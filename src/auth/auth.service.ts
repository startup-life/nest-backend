import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { FileService } from '../file/file.service';
import { User } from '../user/user.entity';
import {LoginUserDto} from "./dto/login-user.dto";
import {SignUpUserDto} from "./dto/sign-up-user.dto";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {GetProfileImagePathDto} from "../file/dto/get-profile-image-path.dto";
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

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

        // 암호화 된 비밀번호 비교
        const validPassword = await bcrypt.compare(password, user.password);
        if (!user || !validPassword) throw new UnauthorizedException('invalid email or password');


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
        if (isExistEmail) throw new BadRequestException('already exist email');

        // 닉네임 중복 체크
        const isExistNickname = await this.userService.checkNickname(nickname);
        if (isExistNickname) throw new BadRequestException('already exist nickname');

        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        if (!hashedPassword) throw new InternalServerErrorException('failed hash password');

        // 계정 정보 생성
        const createUserDto: CreateUserDto = {
            email,
            password: hashedPassword,
            nickname,
            profileImagePath,
        };
        const user = await this.userService.createUser(createUserDto);

        if (!user) throw new InternalServerErrorException('failed create user');

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

        if (!getProfileImage) return '/public/image/profile/default.png';

        return getProfileImage;
    }
}
