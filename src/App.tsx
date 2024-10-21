import { Suspense, lazy } from 'react';
import { ThemeProvider } from '@mui/material';
import styled from 'styled-components';
import { useAppSelector } from './store/hooks';
import { GlobalStyles } from './theme/GlobalStyles';
import themes from './theme';

/* Components */
import Header from './components/Header';
import ToolsHeader from './components/ToolsHeader';
import Menu from './components/Menu';
import Footer from './components/Footer';
import SnapshotView from './components/SnapshotView';
import { PopupContainer } from './components/Popup';
import { Tooltip } from 'react-tooltip';

/* Store */

/* Interfaces */
interface EditorContainerProps {
  $isMenuOpen: boolean;
}

/* Styles */
const AppContainer = styled.div`
  color: ${({ theme }) => theme.palette.text.primary};
  background-color: ${({ theme }) => theme.colors.mainBackground};
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const MainContainer = styled.div`
  overflow: hidden;
  flex: 1;
  position: relative;

  display: flex;
  align-items: stretch;
`;

const EditorContainer = styled.div<EditorContainerProps>`
  overflow: hidden;
  flex: 1 0;
  margin: 0px 1rem;
  margin-right: ${({ $isMenuOpen }) => ($isMenuOpen ? 'calc(max(42rem, 24vw) + 1rem)' : '7rem')};
  background-color: ${({ theme }) => theme.colors.contentBackground};

  display: flex;
  flex-direction: column;
  align-items: stretch;

  @media only screen and (max-width: 1024px) {
    margin: 0px 7rem 0px 1rem;
  }
`;

const EditorLoadingContainer = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.contentBackground};
`;

/* Lazy load the editor to use it in a suspense block */
const Editor = lazy(() => import('./components/Editor'));

function App() {
  const isMenuOpen = useAppSelector((state) => state.layout.isMenuOpen);
  const usedTheme = useAppSelector((state) => state.layout.theme);

  return (
    <ThemeProvider theme={themes[usedTheme]}>
      <GlobalStyles />
      <AppContainer>
        <Header />
        <MainContainer>
          <EditorContainer $isMenuOpen={isMenuOpen}>
            <ToolsHeader />
            <Suspense fallback={<EditorLoadingContainer />}>
              <Editor />
            </Suspense>
          </EditorContainer>
          <Menu />
        </MainContainer>
        <Footer />
      </AppContainer>
      <PopupContainer />
      <SnapshotView />
      <Tooltip
        id="main-tooltip"
        place="bottom"
        style={{ backgroundColor: '#156E08', fontSize: '1.4rem', zIndex: 999 }}
      />
    </ThemeProvider>
  );
}

export default App;
