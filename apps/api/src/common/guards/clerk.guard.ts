import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyToken } from '@clerk/backend';
import type { Request } from 'express';

export type CurrentUserRequest = Request & {
  currentUser?: {
    clerkId: string;
  };
};

function getBearerToken(request: Request): string | null {
  const header = request.headers.authorization;

  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

@Injectable()
export class ClerkGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<CurrentUserRequest>();
    const token = getBearerToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing Clerk bearer token');
    }

    const secretKey = process.env.CLERK_SECRET_KEY;

    if (!secretKey) {
      throw new UnauthorizedException('Missing CLERK_SECRET_KEY');
    }

    try {
      const payload = await verifyToken(token, { secretKey });

      if (!payload.sub) {
        throw new UnauthorizedException('Invalid Clerk token');
      }

      request.currentUser = {
        clerkId: payload.sub,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid Clerk token');
    }
  }
}
