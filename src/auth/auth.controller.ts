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
    ApiInternalServerErrorResponse,
    ApiResponse,
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
    @ApiResponse({
        status: 200,
        description: '로그인 성공',
        example: {
            userId: 1,
            email: 'test@test.com',
            nickname: 'test1234',
            fileId: 1,
            createdAt: '0000-00-00T00:00:00.000Z',
            updatedAt: '0000-00-00T00:00:00.000Z',
            deletedAt: null,
            profileImagePath: 'profile-image-path',
            accessToken: 'access-token',
        },
    })
    @ApiBadRequestResponse({ description: '잘못된 이메일 또는 비밀번호' })
    @ApiUnauthorizedResponse({ description: '로그인 실패' })
    async loginUser(@Body() loginUserDto: LoginUserDto) {
        return await this.authService.loginUser(loginUserDto);
    }

    // 회원가입
    @Post('signup')
    @ApiResponse({
        status: 201,
        description: '회원가입 성공',
        example: {
            userId: 1,
            email: 'test@test.com',
            nickname: 'test1234',
            fileId: 1,
            sessionId: null,
            createdAt: '0000-00-00T00:00:00.000Z',
            updatedAt: '0000-00-00T00:00:00.000Z',
            deletedAt: null,
        },
    })
    @ApiBadRequestResponse({ description: '이미 존재하는 이메일 또는 닉네임' })
    @ApiInternalServerErrorResponse({ description: '회원가입 실패' })
    async signUpUser(@Body() signUpUserDto: SignUpUserDto) {
        return await this.authService.signUpUser(signUpUserDto);
    }

    // 로그인 상태 확인
    @UseGuards(AuthGuard('jwt'))
    @Get('check')
    @ApiResponse({
        status: 200,
        description: '로그인 상태 확인 성공',
        example: {
            userId: 1,
            email: 'test@test.com',
            nickname: 'test1234',
            fileId: 1,
            sessionId: 'session-id',
            createdAt: '0000-00-00T00:00:00.000Z',
            updatedAt: '0000-00-00T00:00:00.000Z',
            deletedAt: null,
            profileImagePath: 'profile-image-path',
        },
    })
    @ApiUnauthorizedResponse({ description: '로그인 상태 확인 실패' })
    async checkAuth(@Request() request: any) {
        return request.user;
    }
}
