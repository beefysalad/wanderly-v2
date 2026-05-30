import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { CurrentUserRequest } from '../guards/clerk.guard';

export const ClerkUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<CurrentUserRequest>();

    if (!request.currentUser?.clerkId) {
      throw new UnauthorizedException('Clerk user id is missing from request');
    }

    return request.currentUser.clerkId;
  },
);
