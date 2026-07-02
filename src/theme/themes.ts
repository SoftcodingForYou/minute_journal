/** App color themes, ported from the original Flutter app's four palettes. */

export type ThemeKey = 'mint' | 'purple' | 'sky' | 'summer';

export interface AppTheme {
  key: ThemeKey;
  primary: string; // main accent (headers, active icons, buttons)
  highlight: string; // lighter accent (button backgrounds, chips)
  onPrimary: string; // text/icon color on top of `primary`
  title: string; // strong heading text
  body: string; // body text
  muted: string; // secondary text
  background: string; // screen background
  surface: string; // cards / elevated areas
  border: string; // dividers
  alert: string; // destructive / delete
  /** Mood gradient top→bottom = good→bad; also used for the 3 mood categories. */
  moodColors: [string, string, string];
}

export const DEFAULT_THEME_KEY: ThemeKey = 'mint';

export const THEMES: Record<ThemeKey, AppTheme> = {
  mint: {
    key: 'mint',
    primary: '#00897B',
    highlight: '#80CBC4',
    onPrimary: '#FFFFFF',
    title: '#00796B',
    body: '#00695C',
    muted: '#60646C',
    background: '#FFFFFF',
    surface: '#F2FBF9',
    border: '#B2DFDB',
    alert: '#D53E4F',
    moodColors: ['#DCDC78', '#95B74D', '#4D9221'],
  },
  purple: {
    key: 'purple',
    primary: '#8E24AA',
    highlight: '#CE93D8',
    onPrimary: '#FFFFFF',
    title: '#7B1FA2',
    body: '#6A1B9A',
    muted: '#6B6472',
    background: '#FFFFFF',
    surface: '#FAF4FC',
    border: '#E1BEE7',
    alert: '#D53E4F',
    moodColors: ['#F768A1', '#A03486', '#49006A'],
  },
  sky: {
    key: 'sky',
    primary: '#1976D2',
    highlight: '#90CAF9',
    onPrimary: '#FFFFFF',
    title: '#1565C0',
    body: '#0D47A1',
    muted: '#5B6472',
    background: '#FFFFFF',
    surface: '#F1F7FE',
    border: '#BBDEFB',
    alert: '#D53E4F',
    moodColors: ['#A6BDDB', '#537B9A', '#023858'],
  },
  summer: {
    key: 'summer',
    primary: '#E65100',
    highlight: '#FFCC80',
    onPrimary: '#6D4C41',
    title: '#E65100',
    body: '#BF360C',
    muted: '#726158',
    background: '#FFFFFF',
    surface: '#FFF6EE',
    border: '#FFE0B2',
    alert: '#D53E4F',
    moodColors: ['#CCAD00', '#66885D', '#0066B9'],
  },
};

export const THEME_KEYS = Object.keys(THEMES) as ThemeKey[];

export function isThemeKey(v: string): v is ThemeKey {
  return v in THEMES;
}
