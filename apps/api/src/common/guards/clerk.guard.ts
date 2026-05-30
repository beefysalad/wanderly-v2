import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyToken } from '@clerk/backend';
import type { Request } from 'express';

export type AuthenticatedUser = {
  clerkId: string;
  isAdmin: boolean;
};

export type CurrentUserRequest = Request & {
  currentUser?: AuthenticatedUser;
};

const ADMIN_ROLES = new Set(['admin', 'org:admin']);

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasAdminRole(value: unknown): boolean {
  return typeof value === 'string' && ADMIN_ROLES.has(value);
}

function hasAdminMetadata(payload: Record<string, unknown>): boolean {
  const metadataClaims = [
    payload.metadata,
    payload.public_metadata,
    payload.publicMetadata,
  ];

  return metadataClaims.some(
    (metadata) =>
      isRecord(metadata) &&
      (metadata.admin === true || hasAdminRole(metadata.role)),
  );
}

function hasAdminAccess(payload: Record<string, unknown>): boolean {
  return (
    payload.admin === true ||
    hasAdminRole(payload.role) ||
    hasAdminRole(payload.org_role) ||
    hasAdminMetadata(payload)
  );
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
        isAdmin: hasAdminAccess(payload),
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid Clerk token');
    }
  }
}
