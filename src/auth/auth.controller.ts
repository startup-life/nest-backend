import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * 로그인
     * 회원가입
     * 로그인 상태 확인
     * 로그아웃
     */

    // 로그인
    @Post('login')
    @ApiBody({ type: LoginUserDto, description: '로그인 요청 데이터' })
    @ApiOkResponse({
        description: '로그인 성공',
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'integer' },
                email: { type: 'string' },
                nickname: { type: 'string' },
                fileId: { type: 'integer' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                deletedAt: { type: 'string', nullable: true },
                profileImagePath: { type: 'string' },
                accessToken: { type: 'string' },
            },
            example: {
                userId: 1,
                email: 'test@test.com',
                nickname: 'test1234',
                fileId: 1,
                createdAt: '0000-00-00T00:00:00.000Z',
                updatedAt: '0000-00-00T00:00:00.000Z',
                deletedAt: null,
                profileImagePath: 'image/profile/test.jpg',
                accessToken: 'access.token',
            },
        },
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        content: {
            'application/json': {
                examples: {
                    invalidEmail: {
                        summary: '이메일 형식 오류',
                        value: {
                            message: [
                                'email must be an email',
                                'email should not be empty',
                            ],
                            error: 'Bad Request',
                            statusCode: 400,
                        },
                    },
                    invalidPassword: {
                        summary: '비밀번호 형식 오류',
                        value: {
                            message: [
                                'password should not be empty',
                                'password must be a string',
                            ],
                            error: 'Bad Request',
                            statusCode: 400,
                        },
                    },
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: '잘못된 이메일 또는 비밀번호',
        content: {
            'application/json': {
                examples: {
                    wrongEmailOrPassword: {
                        summary: '잘못된 이메일 또는 비밀번호',
                        value: {
                            statusCode: 401,
                            message: 'invalid email or password',
                            error: 'Unauthorized',
                        },
                    },
                },
            },
        },
    })
    async loginUser(@Body() loginUserDto: LoginUserDto) {
        return await this.authService.loginUser(loginUserDto);
    }

    // 회원가입
    @Post('signup')
    @ApiBody({ type: SignUpUserDto, description: '회원가입 요청 데이터' })
    @ApiCreatedResponse({
        description: '회원가입 성공',
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'integer' },
                email: { type: 'string' },
                nickname: { type: 'string' },
                fileId: { type: 'integer' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                deletedAt: { type: 'string', nullable: true },
            },
            example: {
                userId: 1,
                email: 'test@test.com',
                nickname: 'test1234',
                fileId: 1,
                createdAt: '0000-00-00T00:00:00.000Z',
                updatedAt: '0000-00-00T00:00:00.000Z',
                deletedAt: null,
            },
        },
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청 또는 이미 존재하는 이메일/닉네임',
        content: {
            'application/json': {
                examples: {
                    invalidEmail: {
                        summary: '이메일 형식이 잘못됨',
                        value: {
                            statusCode: 400,
                            message: [
                                'email must be an email',
                                'email should not be empty',
                            ],
                            error: 'Bad Request',
                        },
                    },
                    invalidPassword: {
                        summary: '비밀번호 형식이 잘못됨',
                        value: {
                            statusCode: 400,
                            message: [
                                'password must be a string',
                                'password should not be empty',
                                'password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
                            ],
                            error: 'Bad Request',
                        },
                    },
                    emailOrNicknameExists: {
                        summary: '이미 존재하는 이메일 또는 닉네임',
                        value: {
                            statusCode: 400,
                            message: [
                                'already exist email',
                                'already exist nickname',
                            ],
                            error: 'Bad Request',
                        },
                    },
                },
            },
        },
    })
    @ApiInternalServerErrorResponse({ description: '회원가입 실패' })
    async signUpUser(@Body() signUpUserDto: SignUpUserDto) {
        return await this.authService.signUpUser(signUpUserDto);
    }

    // 로그인 상태 확인
    @UseGuards(AuthGuard('jwt'))
    @Get('check')
    @ApiBearerAuth()
    @ApiOkResponse({
        description: '로그인 상태 확인 성공',
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'integer' },
                email: { type: 'string' },
                nickname: { type: 'string' },
                fileId: { type: 'integer' },
                sessionId: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                deletedAt: { type: 'string', nullable: true },
                profileImagePath: { type: 'string' },
            },
        },
        example: {
            userId: 1,
            email: 'test@test.com',
            nickname: 'test1234',
            fileId: 1,
            sessionId: null,
            createdAt: '0000-00-00T00:00:00.000Z',
            updatedAt: '0000-00-00T00:00:00.000Z',
            deletedAt: null,
            profileImagePath: 'image/profile/test.jpg',
        },
    })
    @ApiUnauthorizedResponse({
        description: '유효하지 않은 토큰',
        content: {
            'application/json': {
                example: {
                    unauthorized: {
                        summary: '로그인 상태 확인 실패',
                        value: {
                            statusCode: 401,
                            message: 'Unauthorized',
                        },
                    },
                },
            },
        },
    })
    async checkAuth(@Request() request: any) {
        return request.user;
    }
}
