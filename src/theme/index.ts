import darkTheme from './darkTheme';
import lightTheme from './lightTheme';

declare module '@mui/material/styles' {
  interface Theme {
    colors: {
      highlightBlue: string; // Logo blue
      highlightGreen: string; // Logo green
      highlightRed: string; // Logo green
      highlightPurple: string; // Logo purple
      highlightOrange: string; // Logo orange

      mainBackground: string;
      contentBackground: string;
      headerBackground: string;
      toolsHeaderBackground: string;
      snapshotViewBackground: string;

      toolsHeaderButton: string;
      toolsHeaderButtonHover: string;
      toolsHeaderButtonActive: string;
      toolsHeaderButtonActivePlay: string;
      toolsHeaderButtonActivePause: string;
      toolsHeaderButtonActiveBreakpoint: string;
      toolsHeaderButtonDisabled: string;
      toolsHeaderButtonDiscreet: string;
      toolsHeaderButtonBackground: string;
      toolsHeaderActiveBorder: string;

      variableViewVariableBase: string;
      variableViewVariableName: string;
      variableViewVariableBorder: string;
      variableViewArrayName: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    colors: {
      highlightBlue: string; // Logo blue
      highlightGreen: string; // Logo green
      highlightRed: string; // Logo green
      highlightPurple: string; // Logo purple
      highlightOrange: string; // Logo orange

      mainBackground: string;
      contentBackground: string;
      headerBackground: string;
      toolsHeaderBackground: string;
      snapshotViewBackground: string;

      toolsHeaderButton: string;
      toolsHeaderButtonHover: string;
      toolsHeaderButtonActive: string;
      toolsHeaderButtonActivePlay: string;
      toolsHeaderButtonActivePause: string;
      toolsHeaderButtonActiveBreakpoint: string;
      toolsHeaderButtonDisabled: string;
      toolsHeaderButtonDiscreet: string;
      toolsHeaderButtonBackground: string;
      toolsHeaderActiveBorder: string;

      variableViewVariableBase: string;
      variableViewVariableName: string;
      variableViewVariableBorder: string;
      variableViewArrayName: string;
    };
  }
}

const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export default themes;
export type ThemeName = keyof typeof themes;
