import { createTheme } from '@mui/material/styles';

const CustomData = {
  colors: {
    highlightBlue: '#07baef', // Logo blue
    highlightGreen: '#41e600', // Logo green
    highlightRed: '#e5006d', // Logo green
    highlightPurple: '#831f82', // Logo purple
    highlightOrange: '#ec6707', // Logo orange

    mainBackground: '#ccc',
    contentBackground: '#ffffff',
    headerBackground: '#101010',
    toolsHeaderBackground: '#eeeeee',
    snapshotViewBackground: '#ffffff',

    toolsHeaderButton: '#1e1e1e',
    toolsHeaderButtonHover: '#000',
    toolsHeaderButtonActive: '#046fd9',
    toolsHeaderButtonActivePlay: '#41e600',
    toolsHeaderButtonActivePause: '#DDE000',
    toolsHeaderButtonActiveBreakpoint: '#831f82',
    toolsHeaderButtonDisabled: '#cccccc',
    toolsHeaderButtonDiscreet: '#555555',
    toolsHeaderButtonBackground: '#ccc',
    toolsHeaderActiveBorder: '#888888',

    variableViewVariableBase: '#00996B',
    variableViewVariableName: '#949494',
    variableViewVariableBorder: '#A1A1A1',
    variableViewArrayName: '#E6AC00',
  },
};

const lightTheme = createTheme(
  {
    palette: {
      mode: 'light',
      primary: { main: '#0084CC' },
      secondary: { main: '#04A64B' },
    },
    typography: {
      /* Tell Material-UI what's the font-size on the html element is. */
      htmlFontSize: 10,
      fontSize: 14,
    },
  },
  CustomData
);

export type LightTheme = typeof lightTheme & typeof CustomData;
export default lightTheme;
