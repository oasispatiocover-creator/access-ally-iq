import { useColorScheme } from 'react-native';

export const light = {
  bg: '#EEF3F8',
  surface: '#FFFFFF',
  ink: '#0B2350',
  muted: '#51627A',
  line: '#D4DEE9',
  accent: '#0A6FD0',
  accentInk: '#FFFFFF',
  accentSoft: '#E0EEFB',
  ok: '#2F7A52',
  okSoft: '#DDEFE4',
  no: '#B3261E',
  noSoft: '#F7E0DE',
  maybe: '#8A5A00',
  maybeSoft: '#FBEFD9',
  staffBg: '#0B2350',
  staffMuted: '#B9C6D6',
  teal: '#12B5C4',
};

export const dark: typeof light = {
  bg: '#0A1426',
  surface: '#122039',
  ink: '#E6EEF8',
  muted: '#9AAAC0',
  line: '#263957',
  accent: '#4FA8F5',
  accentInk: '#06142B',
  accentSoft: '#143056',
  ok: '#6CC495',
  okSoft: '#1C3328',
  no: '#F08A80',
  noSoft: '#3A2224',
  maybe: '#E3B341',
  maybeSoft: '#3A2F14',
  staffBg: '#000000',
  staffMuted: '#B9C6D6',
  teal: '#2ED0DC',
};

export type Colors = typeof light;

export function useColors(): Colors {
  return useColorScheme() === 'dark' ? dark : light;
}

// System fonts keep the app light; swap in Atkinson Hyperlegible and
// Bricolage Grotesque with expo-font when the brand fonts are licensed and bundled.
export const type = {
  h1: { fontSize: 28, fontWeight: '800' as const, lineHeight: 34 },
  h2: { fontSize: 20, fontWeight: '700' as const, lineHeight: 26 },
  h3: { fontSize: 17, fontWeight: '700' as const, lineHeight: 23 },
  body: { fontSize: 16, lineHeight: 23 },
  small: { fontSize: 14, lineHeight: 20 },
  cite: { fontSize: 12, lineHeight: 17, fontFamily: undefined as string | undefined },
  eyebrow: { fontSize: 12, fontWeight: '700' as const, letterSpacing: 1, textTransform: 'uppercase' as const },
};
