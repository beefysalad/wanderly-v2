import { Injectable } from '@nestjs/common';
import type { ApiHealthResponse } from '@workspace/shared';

@Injectable()
export class AppService {
  getHealth(): ApiHealthResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
