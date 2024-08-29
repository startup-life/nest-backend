import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Patch,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserMatchGuard } from '../common/guard/user-match.guard';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiParam,
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    /**
     * 유저 정보 가져오기
     * 회원 정보 수정
     * 비밀번호 변경
     * 회원 탈퇴
     * 이메일 중복 체크
     * 닉네임 중복 체크
     */

    // 유저 정보 가져오기
    @Get(':user_id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiParam({ name: 'user_id', example: 1, description: '유저 ID' })
    @ApiOkResponse({
        description: '유저 정보 가져오기 성공',
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'integer' },
                email: { type: 'string' },
                nickname: { type: 'string' },
                fileId: { type: 'integer' },
                sessionId: { type: 'string', nullable: true },
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
    @ApiBadRequestResponse({
        description: 'userId 파라미터가 없음',
        content: {
            'application/json': {
                example: {
                    summary: 'userId 파라미터가 없음',
                    value: {
                        message: 'invalid userId',
                        error: 'Bad Request',
                        statusCode: 400,
                    },
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: '유효한 토큰이 없음',
        content: {
            'application/json': {
                example: {
                    summary: '토큰 인증 실패',
                    value: {
                        message: 'Unauthorized',
                        statusCode: 401,
                    },
                },
            },
        },
    })
    @ApiNotFoundResponse({
        description: '유저 정보 없음',
        content: {
            'application/json': {
                example: {
                    summary: '유저 정보를 찾을 수 없음',
                    value: {
                        message: 'not found user',
                        error: 'Not Found',
                        statusCode: 404,
                    },
                },
            },
        },
    })
    async getUserById(@Param('user_id', ParseIntPipe) userId: number) {
        if (!userId) throw new BadRequestException('invalid userId');

        return await this.userService.getUserById(userId);
    }

    // 회원 정보 수정
    @Put(':user_id')
    @UseGuards(AuthGuard('jwt'), UserMatchGuard)
    @ApiBearerAuth()
    @ApiParam({ name: 'user_id', example: 1, description: '유저 ID' })
    @ApiBody({ type: UpdateUserDto, description: '회원 정보 수정 데이터' })
    @ApiOkResponse({
        description: '회원 정보 수정 성공',
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'integer' },
                email: { type: 'string' },
                nickname: { type: 'string' },
                fileId: { type: 'integer' },
                sessionId: { type: 'string', nullable: true },
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
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        content: {
            'application/json': {
                examples: {
                    invalidNickname: {
                        summary: '닉네임 형식 오류',
                        value: {
                            message: [
                                'nickname must be a string',
                                'nickname must be longer than or equal to 2 characters',
                                'nickname must be shorter than or equal to 10 characters',
                                'nickname must match /^[가-힣a-zA-Z0-9]{2,10}$/ regular expression',
                            ],
                            error: 'Bad Request',
                            statusCode: 400,
                        },
                    },
                    invalidProfileImagePath: {
                        summary: '프로필 이미지 경로 형식 오류',
                        value: {
                            message: ['profileImagePath must be a string'],
                            error: 'Bad Request',
                            statusCode: 400,
                        },
                    },
                    invalidUserId: {
                        summary: 'userId 파라미터가 없음',
                        value: {
                            message: 'invalid userId',
                            error: 'Bad Request',
                            statusCode: 400,
                        },
                    },
                },
            },
        },
    })
    @ApiNotFoundResponse({
        description: '유저 정보 없음',
        content: {
            'application/json': {
                example: {
                    summary: '유저 정보를 찾을 수 없음',
                    value: {
                        message: 'not found user',
                        error: 'Not Found',
                        statusCode: 404,
                    },
                },
            },
        },
    })
    async updateUser(
        @Param('user_id', ParseIntPipe) userId: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        if (!userId) throw new BadRequestException('invalid userId');

        return await this.userService.updateUser(userId, updateUserDto);
    }

    // 비밀번호 변경
    @Patch(':user_id/password')
    @UseGuards(AuthGuard('jwt'), UserMatchGuard)
    @ApiBearerAuth()
    @ApiParam({ name: 'user_id', example: 1, description: '유저 ID' })
    @ApiBody({ type: UpdatePasswordDto, description: '비밀번호 변경 데이터' })
    @ApiOkResponse({
        description: '비밀번호 변경 성공',
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'integer' },
                email: { type: 'string' },
                nickname: { type: 'string' },
                fileId: { type: 'integer' },
                sessionId: { type: 'string', nullable: true },
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
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        content: {
            'application/json': {
                examples: {
                    invalidUserId: {
                        summary: 'userId 파라미터가 없음',
                        value: {
                            message: 'invalid userId',
                            error: 'Bad Request',
                            statusCode: 400,
                        },
                    },
                    invalidPassword: {
                        summary: '올바르지 않은 비밀번호 형식',
                        value: {
                            message: [
                                'password must be a string',
                                'password must be longer than or equal to 8 characters',
                                'password must be shorter than or equal to 20 characters',
                                'password must match /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$/ regular expression',
                            ],
                            error: 'Bad Request',
                            statusCode: 400,
                        },
                    },
                },
            },
        },
    })
    @ApiNotFoundResponse({
        description: '유저 정보 없음',
        content: {
            'application/json': {
                example: {
                    summary: '유저 정보를 찾을 수 없음',
                    value: {
                        message: 'not found user',
                        error: 'Not Found',
                        statusCode: 404,
                    },
                },
            },
        },
    })
    async updatePassword(
        @Param('user_id', ParseIntPipe) userId: number,
        @Body() updatePasswordDto: UpdatePasswordDto,
    ) {
        if (!userId) throw new BadRequestException('invalid userId');

        return await this.userService.updatePassword(userId, updatePasswordDto);
    }

    // 회원 탈퇴
    @Delete(':user_id')
    @UseGuards(AuthGuard('jwt'), UserMatchGuard)
    @HttpCode(204)
    @ApiBearerAuth()
    @ApiParam({ name: 'user_id', example: 1, description: '유저 ID' })
    @ApiNoContentResponse({ description: '회원 탈퇴 성공' })
    @ApiBadRequestResponse({
        description: 'userId 파라미터가 없음',
        content: {
            'application/json': {
                example: {
                    summary: 'userId 파라미터가 없음',
                    value: {
                        message: 'invalid userId',
                        error: 'Bad Request',
                        statusCode: 400,
                    },
                },
            },
        },
    })
    @ApiNotFoundResponse({
        description: '유저 정보 없음',
        content: {
            'application/json': {
                example: {
                    summary: '유저 정보를 찾을 수 없음',
                    value: {
                        message: 'not found user',
                        error: 'Not Found',
                        statusCode: 404,
                    },
                },
            },
        },
    })
    async softDeleteUser(@Param('user_id', ParseIntPipe) userId: number) {
        if (!userId) throw new BadRequestException('invalid userId');

        return await this.userService.softDeleteUser(userId);
    }

    // 이메일 중복 체크
    @Get('check/email')
    @ApiQuery({
        name: 'email',
        example: 'test@test.com',
        description: '이메일',
    })
    @ApiOkResponse({
        description: '이메일 중복 체크 성공',
        schema: {
            type: 'boolean',
            description: '이메일 중복 여부',
        },
        example: false,
    })
    @ApiBadRequestResponse({
        description: '이메일이 없음',
        content: {
            'application/json': {
                example: {
                    summary: '이메일이 없음',
                    value: {
                        message: 'email is required',
                        error: 'Bad Request',
                        statusCode: 400,
                    },
                },
            },
        },
    })
    async checkEmail(@Query('email') email: string) {
        if (!email) throw new BadRequestException('email is required');

        return await this.userService.checkEmail(email);
    }

    // 닉네임 중복 체크
    @Get('check/nickname')
    @ApiOkResponse({
        description: '닉네임 중복 체크 성공',
        schema: {
            type: 'boolean',
            description: '닉네임 중복 여부',
        },
        example: false,
    })
    @ApiBadRequestResponse({
        description: '닉네임이 없음',
        content: {
            'application/json': {
                example: {
                    summary: '닉네임이 없음',
                    value: {
                        message: 'nickname is required',
                        error: 'Bad Request',
                        statusCode: 400,
                    },
                },
            },
        },
    })
    async checkNickname(@Query('nickname') nickname: string) {
        if (!nickname) throw new BadRequestException('nickname is required');

        return await this.userService.checkNickname(nickname);
    }
}
