import { Controller, Get } from '@nestjs/common';
import type { ApiHealthResponse } from '@workspace/shared';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealth(): ApiHealthResponse {
    return this.appService.getHealth();
  }
}
