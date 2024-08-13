import {Body, Controller, Delete, Get, HttpCode, Patch, Post, Put} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRequest(): string {
    return 'GET 요청에 성공했습니다.';
  }

  @Post()
  @HttpCode(201)
  postRequest(@Body() body: any) {
    return {
      status: 201,
      message: 'POST 요청에 성공했습니다.',
      data: body,
    };
  }

  @Put()
  putRequest(@Body() body: any) {
    return {
      status: 200,
      message: 'PUT 요청에 성공했습니다.',
      data: body,
    };
  }

  @Patch()
  patchRequest(@Body() body: any) {
    return {
      status: 200,
      message: 'PATCH 요청에 성공했습니다.',
      data: body,
    };
  }

  @Delete()
  @HttpCode(204)
  deleteRequest() {
    return {
      status: 204,
      message: 'DELETE 요청에 성공했습니다.',
      data: null,
    };
  }
}
