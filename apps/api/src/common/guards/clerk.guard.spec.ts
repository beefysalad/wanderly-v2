import { UnauthorizedException } from '@nestjs/common';
import { verifyToken } from '@clerk/backend';
import { ClerkGuard } from './clerk.guard';

jest.mock('@clerk/backend', () => ({
  verifyToken: jest.fn(),
}));

const mockVerifyToken = jest.mocked(verifyToken);

function createContext(authorization?: string) {
  const request = {
    headers: {
      authorization,
    },
  };

  return {
    request,
    context: {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    },
  };
}

describe('ClerkGuard', () => {
  const originalSecretKey = process.env.CLERK_SECRET_KEY;

  beforeEach(() => {
    process.env.CLERK_SECRET_KEY = 'sk_test_unit';
    mockVerifyToken.mockReset();
  });

  afterAll(() => {
    process.env.CLERK_SECRET_KEY = originalSecretKey;
  });

  it('rejects requests without a bearer token', async () => {
    const guard = new ClerkGuard();
    const { context } = createContext();

    await expect(guard.canActivate(context as never)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rejects invalid Clerk JWTs', async () => {
    mockVerifyToken.mockRejectedValueOnce(new Error('invalid token'));

    const guard = new ClerkGuard();
    const { context } = createContext('Bearer invalid');

    await expect(guard.canActivate(context as never)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('attaches the Clerk subject and default admin access to currentUser', async () => {
    mockVerifyToken.mockResolvedValueOnce({ sub: 'user_123' } as never);

    const guard = new ClerkGuard();
    const { context, request } = createContext('Bearer valid.jwt');

    await expect(guard.canActivate(context as never)).resolves.toBe(true);
    expect(mockVerifyToken).toHaveBeenCalledWith('valid.jwt', {
      secretKey: 'sk_test_unit',
    });
    expect(request).toMatchObject({
      currentUser: {
        clerkId: 'user_123',
        isAdmin: false,
      },
    });
  });

  it('marks users with an admin Clerk claim as admins', async () => {
    mockVerifyToken.mockResolvedValueOnce({
      public_metadata: {
        role: 'admin',
      },
      sub: 'user_123',
    } as never);

    const guard = new ClerkGuard();
    const { context, request } = createContext('Bearer valid.jwt');

    await expect(guard.canActivate(context as never)).resolves.toBe(true);
    expect(request).toMatchObject({
      currentUser: {
        clerkId: 'user_123',
        isAdmin: true,
      },
    });
  });
});
