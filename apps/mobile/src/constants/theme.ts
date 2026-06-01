/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

/** "Deep Ocean" theme colors — teal accent on cool ocean-ink surfaces. */
export const Colors = {
  light: {
    text: '#0B1822',
    background: '#EEF1F4',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E9EEF2',
    textSecondary: '#51616E',
    accent: '#0E9E92',
  },
  dark: {
    text: '#EAF1F8',
    background: '#070B11',
    backgroundElement: '#0F151E',
    backgroundSelected: '#161E2A',
    textSecondary: '#93A1B0',
    accent: '#34D6C8',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * Solid tone bases that sit under real destination photography (and stand in
 * as a graceful fallback when no image is present). No gradients — single
 * cool fills per the Deep Ocean system.
 */
export const PhotoTones = {
  ocean: '#0E3743',
  island: '#0B4A4A',
  jungle: '#133229',
  dune: '#0C2E3A',
  highland: '#1B2C2E',
  sunset: '#2A2336',
  night: '#2A2336',
} as const;

export type PhotoTone = keyof typeof PhotoTones;

/**
 * Stock destination photography (swappable placeholders). Real images fade in
 * over the solid {@link PhotoTones} base via the `<Photo src>` prop.
 */
export const Photos = {
  siargao:
    'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1000&q=70',
  elnido:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=70',
  coron:
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=70',
  anilao:
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=70',
  sagada:
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1000&q=70',
  sunset:
    'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?auto=format&fit=crop&w=1000&q=70',
} as const;

export type PhotoKey = keyof typeof Photos;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
