import { useColorScheme } from 'react-native';

const light = {
  dark: false,
  background: '#FFFFFF',
  text: '#000000',
  secondaryText: '#666666',
  tertiaryText: '#999999',
  card: 'rgba(127, 127, 127, 0.12)',
  link: '#007AFF',
};

const dark: typeof light = {
  dark: true,
  background: '#000000',
  text: '#FFFFFF',
  secondaryText: '#A1A1A6',
  tertiaryText: '#6E6E73',
  card: 'rgba(127, 127, 127, 0.24)',
  link: '#0A84FF',
};

export type Theme = typeof light;

/** Colors for the current system appearance. */
export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}
