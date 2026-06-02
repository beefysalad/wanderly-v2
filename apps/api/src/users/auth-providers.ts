import type { AuthProvider } from '@workspace/shared';

type ClerkExternalAccount = {
  provider?: string | null;
};

const AUTH_PROVIDER_ORDER: AuthProvider[] = ['GOOGLE', 'APPLE'];

function toAuthProvider(provider: string | null | undefined): AuthProvider | null {
  switch (provider?.replace(/^oauth_/, '').toLowerCase()) {
    case 'google':
      return 'GOOGLE';
    case 'apple':
      return 'APPLE';
    default:
      return null;
  }
}

export function extractAuthProvidersFromExternalAccounts(
  externalAccounts: readonly ClerkExternalAccount[] | null | undefined,
): AuthProvider[] {
  const providers = new Set<AuthProvider>();

  for (const account of externalAccounts ?? []) {
    const provider = toAuthProvider(account.provider);

    if (provider) {
      providers.add(provider);
    }
  }

  return AUTH_PROVIDER_ORDER.filter((provider) => providers.has(provider));
}
