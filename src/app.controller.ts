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
  postRequest(@Body() body: any): any {
    return body;
  }

  @Put()
  putRequest(@Body() body: any): any {
    return body;
  }

  @Patch()
  patchRequest(@Body() body: any): any {
    return body;
  }

  @Delete()
  @HttpCode(204)
  deleteRequest(): null {
    return null;
  }

  @Get('timeout')
  timeoutRequest(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
          resolve('10초 뒤에 응답합니다.');
      }, 10000);
    });
  }
}
