# Mobile Release Readiness

Tracks the release setup for `WND-15`: making `apps/mobile` ready for repeatable EAS builds and future App Store / Play Store deployment.

This document is preparation work only. It does not mean the app is ready for public launch.

## Current Build Config

- Expo app root: `apps/mobile`
- App display name: `Wanderly`
- URL scheme: `wanderly`
- iOS bundle identifier: `com.wanderly.app`
- Android package name: `com.wanderly.app`
- App version: `1.0.0`
- iOS build number: `1`
- Android version code: `1`
- EAS config: `apps/mobile/eas.json`

Before registering store records, confirm that `com.wanderly.app` is the final company-owned identifier. Changing identifiers after release is painful and can affect install/update continuity.

## Environment Strategy

Mobile-exposed variables must use the `EXPO_PUBLIC_` prefix and must be safe to ship inside the app binary.

Required mobile variables:

```bash
EXPO_PUBLIC_API_URL
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
```

Local values live in `apps/mobile/.env.local`, copied from `apps/mobile/.env.example`.

Preview and production EAS builds should define the same variables in EAS environment settings. Production builds must point `EXPO_PUBLIC_API_URL` to a deployed HTTPS API URL, never `localhost`, `10.0.2.2`, or a LAN IP.

Backend-only secrets such as Clerk secret keys, database URLs, and webhook signing secrets must stay in the API environment and must not use `EXPO_PUBLIC_`.

## EAS Profiles

Configured profiles:

- `development`: internal dev-client build for device/simulator testing.
- `preview`: internal distribution build for QA/testers.
- `production`: store-ready build profile.

Expected commands from `apps/mobile`:

```bash
eas whoami
eas build:configure
eas build --profile development --platform ios
eas build --profile development --platform android
eas build --profile preview --platform android
eas build --profile production --platform all
```

Equivalent npm scripts from the repository root:

```bash
npm run eas:build:development:ios -w mobile
npm run eas:build:development:android -w mobile
npm run eas:build:preview:ios -w mobile
npm run eas:build:preview:android -w mobile
npm run eas:build:production -w mobile
```

The generic mobile `build` script intentionally does not start an EAS cloud build. Root `npm run build` runs Turbo across workspaces, so triggering EAS there would make normal repo builds depend on Expo login, credentials, and remote build availability.

The `development` profile is configured for a dev-client build. Install and configure `expo-dev-client` before running that profile.

Submission commands, when store records and credentials are ready:

```bash
eas submit --platform ios --profile production
eas submit --platform android --profile production
```

Equivalent npm scripts from the repository root:

```bash
npm run eas:submit:production:ios -w mobile
npm run eas:submit:production:android -w mobile
```

If using CI, set `EXPO_TOKEN` instead of relying on an interactive Expo login.

## Clerk Mobile Auth Checklist

- Confirm the mobile app uses the correct Clerk publishable key for each environment.
- Configure deep links for `wanderly://`.
- Confirm OAuth callback/deep-link settings for Google sign-in.
- Confirm Apple Sign In requirements before enabling production App Store submission with Apple OAuth.
- QA email sign-up, email verification, sign-in, sign-out, OAuth sign-in, onboarding after auth, and returning through deep links in a real development or preview build.
- Verify session/token storage in a real build using `expo-secure-store`, not only Expo Go.

## Credential Ownership

Recommended starting strategy:

- Use EAS-managed Android keystore unless there is a specific reason to manage it manually.
- Use EAS-managed iOS distribution certificate and provisioning profile unless there is a specific reason to manage them manually.
- Do not commit certificates, keystores, provisioning profiles, private keys, or API tokens.

Ownership to record before the first real store build:

- Expo account or organization owner.
- Apple Developer Program team owner.
- App Store Connect users with release access.
- Google Play Console owner.
- Google Play Console users with release access.

## Store Prerequisite Checklist

- App name.
- Subtitle or short description.
- Full description.
- Keywords and categories.
- Privacy policy URL.
- Support URL.
- Marketing URL, if needed.
- App icon and splash assets.
- Screenshots for required device sizes.
- Age rating and content declarations.
- Apple privacy nutrition labels.
- Google Play data safety form.
- Test account or review notes, if required.

## Pre-Build Checks

Run local checks before requesting production mobile builds:

```bash
npm run typecheck -w mobile
npm run typecheck -w api
npm run build -w api
```

If mobile behavior depends on deployed API behavior, verify the deployed API URL directly before cutting preview or production builds.

## Build Attempt Log

Record the first EAS development or preview build here once Expo account access and credentials are available.

| Date | Profile | Platform | Result | Notes |
| --- | --- | --- | --- | --- |
| Pending | development or preview | Android or iOS | Not attempted | Requires Expo login/credentials. |

## Out Of Scope

- Public app launch.
- Final App Store / Play Store copywriting.
- Final production screenshots.
- Backend deployment beyond documenting the need for a production HTTPS API URL.
- EAS Update setup unless the team explicitly chooses it.
