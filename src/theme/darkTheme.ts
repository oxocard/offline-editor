import { createTheme } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#0084CC' },
    secondary: { main: '#04A64B' },
  },
  typography: {
    /* Tell Material-UI what's the font-size on the html element is. */
    htmlFontSize: 10,
    fontSize: 14,
  },
  colors: {
    highlightBlue: '#07baef', // Logo blue
    highlightGreen: '#41e600', // Logo green
    highlightRed: '#e5006d', // Logo green
    highlightPurple: '#831f82', // Logo purple
    highlightOrange: '#ec6707', // Logo orange

    mainBackground: '#414141',
    contentBackground: '#191919',
    headerBackground: '#101010',
    toolsHeaderBackground: '#333333',
    snapshotViewBackground: '#212121',

    toolsHeaderButton: '#ffffff',
    toolsHeaderButtonHover: '#62b23d',
    toolsHeaderButtonActive: '#046fd9',
    toolsHeaderButtonActivePlay: '#41e600',
    toolsHeaderButtonActivePause: '#fbff00',
    toolsHeaderButtonActiveBreakpoint: '#831f82',
    toolsHeaderButtonDisabled: '#404040',
    toolsHeaderButtonDiscreet: '#bfbfbf',
    toolsHeaderButtonBackground: '#525252',
    toolsHeaderActiveBorder: '#1e1e1e',

    variableViewVariableBase: '#00ffb3',
    variableViewVariableName: '#606060',
    variableViewVariableBorder: '#555555',
    variableViewArrayName: '#dada71',
  },
});

export default darkTheme;
