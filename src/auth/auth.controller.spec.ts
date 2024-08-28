import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from '../user/user.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SignUpUserDto } from './dto/sign-up-user.dto';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        loginUser: jest.fn(),
                        signUpUser: jest.fn(),
                    },
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('loginUser', () => {
        it('로그인 성공 시 유저 데이터를 출력해야한다', async () => {
            const loginUserDto: LoginUserDto = {
                email: 'test@test.kr',
                password: '12341234aS!',
            };
            const user: User = {
                userId: 1,
                email: 'test@test.com',
                password: 'hashedPassword',
                nickname: 'testNickname',
                fileId: 1,
                profileImagePath: 'some/path',
                sessionId: 'session123',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
                accessToken: 'someAccessToken',
                comments: [],
                posts: [],
                files: undefined,
            };

            jest.spyOn(authService, 'loginUser').mockResolvedValue(user);

            const result = await authController.loginUser(loginUserDto);
            expect(result).toEqual(user);
            expect(authService.loginUser).toHaveBeenCalledWith(loginUserDto);
        });

        it('로그인 실패 시 UnauthorizedException 예외를 던져야한다.', async () => {
            const loginUserDto: LoginUserDto = {
                email: 'test@test.com',
                password: 'wrongPassword',
            };
            jest.spyOn(authService, 'loginUser').mockRejectedValue(
                new UnauthorizedException(),
            );

            await expect(
                authController.loginUser(loginUserDto),
            ).rejects.toThrow(UnauthorizedException);
            expect(authService.loginUser).toHaveBeenCalledWith(loginUserDto);
        });

        it('이메일만 작성할 시 BadRequestException 예외를 던져야한다', async () => {
            const loginUserDto: LoginUserDto = {
                email: 'test@test.com',
                password: '',
            };
            jest.spyOn(authService, 'loginUser').mockRejectedValue(
                new BadRequestException(),
            );

            await expect(
                authController.loginUser(loginUserDto),
            ).rejects.toThrow(BadRequestException);
            expect(authService.loginUser).toHaveBeenCalledWith(loginUserDto);
        });

        it('비밀번호만 작성할 시 BadRequestException 예외를 던져야한다', async () => {
            const loginUserDto: LoginUserDto = {
                email: '',
                password: 'wrongPassword',
            };
            jest.spyOn(authService, 'loginUser').mockRejectedValue(
                new BadRequestException(),
            );

            await expect(
                authController.loginUser(loginUserDto),
            ).rejects.toThrow(BadRequestException);
            expect(authService.loginUser).toHaveBeenCalledWith(loginUserDto);
        });

        it('이메일 형식이 올바르지 않을 시 BadRequestException 예외를 던져야한다', async () => {
            const loginUserDto: LoginUserDto = {
                email: 'test.com',
                password: 'wrongPassword',
            };
            jest.spyOn(authService, 'loginUser').mockRejectedValue(
                new BadRequestException(),
            );

            await expect(
                authController.loginUser(loginUserDto),
            ).rejects.toThrow(BadRequestException);
            expect(authService.loginUser).toHaveBeenCalledWith(loginUserDto);
        });
    });

    describe('signUpUser', () => {
        it('유효한 데이터로 회원가입 요청 시 성공적으로 유저를 생성해야 한다.', async () => {
            const signUpUserDto: SignUpUserDto = {
                email: 'test@test.com',
                password: 'Password123!',
                nickname: 'test',
                profileImagePath: '',
            };

            const expectedResult = {
                userId: 1,
                email: signUpUserDto.email,
                password: undefined,
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
            };

            jest.spyOn(authService, 'signUpUser').mockResolvedValue(
                expectedResult,
            );

            const result = await authController.signUpUser(signUpUserDto);

            expect(result).toEqual(expectedResult);
            expect(authService.signUpUser).toHaveBeenCalledWith(signUpUserDto);
        });

        it('올바르지 않은 이메일 형식으로 회원가입 요청 시 BadRequestException 예외를 던져야 한다.', async () => {
            const signUpUserDto: SignUpUserDto = {
                email: 'invalidEmail',
                password: 'Password',
                nickname: 'test',
            };

            jest.spyOn(authService, 'signUpUser').mockRejectedValue(
                new BadRequestException(),
            );
            await expect(
                authController.signUpUser(signUpUserDto),
            ).rejects.toThrow(BadRequestException);
        });

        it('올바르지 않은 비밀번호 형식으로 회원가입 요청 시 BadRequestException 예외를 던져야 한다.', async () => {
            const signUpUserDto: SignUpUserDto = {
                email: 'test@test.com',
                password: 'invalidPassword',
                nickname: 'test',
            };

            jest.spyOn(authService, 'signUpUser').mockRejectedValue(
                new BadRequestException(),
            );
            await expect(
                authController.signUpUser(signUpUserDto),
            ).rejects.toThrow(BadRequestException);
        });

        it('이메일만 작성할 시 BadRequestException 예외를 던져야한다', async () => {
            const signUpUserDto: SignUpUserDto = {
                email: 'test@test.com',
                password: '',
                nickname: 'test',
            };

            jest.spyOn(authService, 'signUpUser').mockRejectedValue(
                new BadRequestException(),
            );
            await expect(
                authController.signUpUser(signUpUserDto),
            ).rejects.toThrow(BadRequestException);
        });

        it('비밀번호만 작성할 시 BadRequestException 예외를 던져야한다', async () => {
            const signUpUserDto: SignUpUserDto = {
                email: '',
                password: 'password',
                nickname: 'test',
            };

            jest.spyOn(authService, 'signUpUser').mockRejectedValue(
                new BadRequestException(),
            );
            await expect(
                authController.signUpUser(signUpUserDto),
            ).rejects.toThrow(BadRequestException);
        });
    });
});
