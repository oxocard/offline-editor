import darkTheme, { DarkTheme } from './darkTheme';
import lightTheme, { LightTheme } from './lightTheme';

const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export default themes;
export type Theme = DarkTheme | LightTheme;
export type ThemeName = keyof typeof themes;
