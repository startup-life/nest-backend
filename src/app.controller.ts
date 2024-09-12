import {Controller, Get} from '@nestjs/common';

@Controller()
export class AppController {
    constructor() {}

    @Get('error')
    testError(): any {
       throw new Error('Test Sentry error');
    }
}
