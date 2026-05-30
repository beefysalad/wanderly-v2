/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#14151B',
    background: '#F4F4F8',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E7E6F0',
    textSecondary: '#5B5D6B',
    accent: '#8466F0',
  },
  dark: {
    text: '#F4F4F8',
    background: '#0B0C10',
    backgroundElement: '#14161E',
    backgroundSelected: '#1C1E29',
    textSecondary: '#9FA0AD',
    accent: '#9B7CFF',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * The "aurora" signature gradient (violet → magenta → coral → peach),
 * reserved for hero moments: the AI generate CTA, the generation orb,
 * primary buttons, the budget balance card. Feed to expo-linear-gradient.
 */
export const AuroraGradient = {
  colors: ['#7C6BFF', '#B05CE6', '#FF6B8A', '#FF9A6B'] as const,
  locations: [0, 0.42, 0.78, 1] as const,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
};

/** Tinted mesh-gradient "photo" placeholders used for destinations. */
export const PhotoTones = {
  sunset: ['#FFB36B', '#FF5C8A', '#6B3FA0'],
  ocean: ['#6EE7E0', '#2E6FE0', '#2348A8'],
  island: ['#BDF3D8', '#4FD1C5', '#1C6FA8'],
  jungle: ['#C7F06B', '#16A34A', '#14564A'],
  night: ['#6D5CFF', '#FF6B8A', '#161232'],
  dune: ['#FFD58A', '#FF8A5C', '#A14B6E'],
} as const;

export type PhotoTone = keyof typeof PhotoTones;

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
