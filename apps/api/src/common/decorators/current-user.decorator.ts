import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type {
  AuthenticatedUser,
  CurrentUserRequest,
} from '../guards/clerk.guard';

export type CurrentUser = AuthenticatedUser;

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CurrentUser => {
    const request = context.switchToHttp().getRequest<CurrentUserRequest>();

    if (!request.currentUser) {
      throw new UnauthorizedException('Current user is missing from request');
    }

    return request.currentUser;
  },
);
