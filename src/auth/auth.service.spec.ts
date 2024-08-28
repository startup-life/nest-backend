import * as bcrypt from 'bcrypt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { FileService } from '../file/file.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from '../user/user.entity';
import { SignUpUserDto } from './dto/sign-up-user.dto';

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

describe('AuthService', () => {
    let authService: AuthService;
    let userService: UserService;
    let fileService: FileService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: {
                        findByEmail: jest.fn(),
                        createUser: jest.fn(), // 모킹된 createUser 메서드 추가
                        checkEmail: jest.fn(), // 모킹된 checkEmail 메서드 추가
                        checkNickname: jest.fn(), // 모킹된 checkNickname 메서드 추가
                    },
                },
                {
                    provide: FileService,
                    useValue: {
                        getProfileImagePath: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
        fileService = module.get<FileService>(FileService);
        jwtService = module.get<JwtService>(JwtService);

        // bcrypt.hash 모킹 설정
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    });

    describe('loginUser', () => {
        it('로그인 성공 시 유저 정보를 반환하도록 해야한다.', async () => {
            const loginUserDto: LoginUserDto = {
                email: 'test@test.com',
                password: '12341234aS!',
            };
            const user: User = {
                userId: 1,
                email: 'test@test.com',
                password: 'hashedPassword', // Hashed password should be used for comparison
                nickname: 'testNickname',
                fileId: 1,
                profileImagePath: 'some/path',
                sessionId: 'session123',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
                accessToken: '',
                comments: [],
                posts: [],
                files: undefined,
            };
            const profileImagePath = '/image/profile/path.jpg';
            const accessToken = 'jwt-token';

            jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Correctly mock bcrypt.compare to return true
            jest.spyOn(fileService, 'getProfileImagePath').mockResolvedValue(
                profileImagePath,
            );
            jest.spyOn(jwtService, 'sign').mockReturnValue(accessToken);

            const result = await authService.loginUser(loginUserDto);

            expect(result).toEqual({
                ...user,
                password: undefined,
                profileImagePath,
                accessToken,
            });

            expect(bcrypt.compare).toHaveBeenCalledWith(
                loginUserDto.password,
                'hashedPassword',
            );

            expect(userService.findByEmail).toHaveBeenCalledWith(
                loginUserDto.email,
            );
            expect(fileService.getProfileImagePath).toHaveBeenCalledWith({
                userId: user.userId,
                fileId: user.fileId,
            });
            expect(jwtService.sign).toHaveBeenCalledWith({
                userId: user.userId,
                email: user.email,
                nickname: user.nickname,
            });
        });

        it('유저 정보가 없으면 UnauthorizedException 예외를 던져야한다.', async () => {
            jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

            const loginUserDto: LoginUserDto = {
                email: 'test@test.com',
                password: 'password',
            };

            await expect(authService.loginUser(loginUserDto)).rejects.toThrow(
                UnauthorizedException,
            );
            expect(userService.findByEmail).toHaveBeenCalledWith(
                loginUserDto.email,
            );
        });

        it('이메일 또는 비밀번호가 일치하지 않으면 UnauthorizedException 예외를 던져야한다.', async () => {
            const loginUserDto: LoginUserDto = {
                email: 'test@test.com',
                password: 'password',
            };
            const user: User = {
                userId: 1,
                email: 'test@test.com',
                password: 'hashedPassword', // Hashed password in user object
                nickname: 'testNickname',
                fileId: 1,
                profileImagePath: 'some/path',
                sessionId: 'session123',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
                accessToken: '',
                comments: [],
                posts: [],
                files: undefined,
            };

            jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Mock password check to fail

            await expect(authService.loginUser(loginUserDto)).rejects.toThrow(
                UnauthorizedException,
            );
            expect(userService.findByEmail).toHaveBeenCalledWith(
                loginUserDto.email,
            );
            expect(bcrypt.compare).toHaveBeenCalledWith(
                loginUserDto.password,
                user.password,
            );
        });
    });

    describe('signUpUser', () => {
        it('회원가입이 정상적으로 이루어져야한다.', async () => {
            const signUpUserDto: SignUpUserDto = {
                email: 'test@test.com',
                password: 'password',
                nickname: 'test',
                profileImagePath: '',
            };

            jest.spyOn(userService, 'checkEmail').mockResolvedValue(false);
            jest.spyOn(userService, 'checkNickname').mockResolvedValue(false);
            jest.spyOn(userService, 'createUser').mockResolvedValue({
                userId: 1,
                email: signUpUserDto.email,
                password: 'hashedPassword',
                nickname: signUpUserDto.nickname,
                fileId: null,
                sessionId: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
                profileImagePath: signUpUserDto.profileImagePath,
                posts: [],
                comments: [],
                files: null,
            });

            const result = await authService.signUpUser(signUpUserDto);

            expect(result).toEqual({
                userId: 1,
                email: signUpUserDto.email,
                nickname: signUpUserDto.nickname,
                fileId: null,
                sessionId: null,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
                deletedAt: null,
                profileImagePath: signUpUserDto.profileImagePath,
                posts: [],
                comments: [],
                files: null,
            });

            expect(userService.checkEmail).toHaveBeenCalledWith(
                signUpUserDto.email,
            );
            expect(userService.checkNickname).toHaveBeenCalledWith(
                signUpUserDto.nickname,
            );
            expect(userService.createUser).toHaveBeenCalled();
        });

        it('중복된 이메일이 존재할 경우 BadRequestException 예외를 던져야한다.', async () => {
            const signUpUserDto: SignUpUserDto = {
                email: 'test@test.com',
                password: 'password',
                nickname: 'test',
                profileImagePath: '',
            };

            jest.spyOn(userService, 'checkEmail').mockResolvedValue(true); // 이메일이 이미 존재하도록 설정

            await expect(authService.signUpUser(signUpUserDto)).rejects.toThrow(
                BadRequestException,
            );
            expect(userService.checkEmail).toHaveBeenCalledWith(
                signUpUserDto.email,
            );
            expect(userService.createUser).not.toHaveBeenCalled();
        });

        it('중복된 닉네임이 존재할 경우 BadRequestException 예외를 던져야한다.', async () => {
            const signUpUserDto: SignUpUserDto = {
                email: 'test@test.com',
                password: 'password',
                nickname: 'test',
                profileImagePath: '',
            };

            jest.spyOn(userService, 'checkEmail').mockResolvedValue(false);
            jest.spyOn(userService, 'checkNickname').mockResolvedValue(true); // 닉네임이 이미 존재하도록 설정

            await expect(authService.signUpUser(signUpUserDto)).rejects.toThrow(
                BadRequestException,
            );
            expect(userService.checkEmail).toHaveBeenCalledWith(
                signUpUserDto.email,
            );
            expect(userService.checkNickname).toHaveBeenCalledWith(
                signUpUserDto.nickname,
            );
            expect(userService.createUser).not.toHaveBeenCalled();
        });
    });
});
