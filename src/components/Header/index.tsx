import { ThemeProvider, styled } from '@mui/material';
import themes from '../../theme';

/* Components */
import ThemeSwitcher from './ThemeSwitch';
import LanguageSelector from './LanguageSelector';

/* Store */
import { useAppSelector } from '../../store/hooks';

/* Images */
import logoNanoPy from '../../assets/svg/logo_nanopy.svg';

/* Styles */
const HeaderContainer = styled('div')`
  background-color: ${({ theme }) => theme.colors.headerBackground};
  height: 6rem;
  min-height: 6rem;
  margin-bottom: 1rem;

  display: flex;
  align-items: center;
`;

const LogoLink = styled('a')`
  height: 100%;

  display: flex;
  align-items: center;
`;

const Logo = styled('img')`
  padding-right: 2rem;
  height: 90%;
`;

const Space = styled('div')`
  flex: 1;
`;

function Header() {
  const language = useAppSelector((state) => state.client.language);

  return (
    <HeaderContainer>
      <LogoLink
        href={language === 'de' ? `https://nanopy.io` : `https://nanopy.io/${language}`}
        target="_blank"
        rel="noreferrer"
      >
        <Logo src={logoNanoPy} alt="Logo NanoPy" id="logo_nanopy" />
      </LogoLink>
      <Space />
      {/* Use the dark theme in the header */}
      <ThemeProvider theme={themes.dark}>
        <ThemeSwitcher />
        <LanguageSelector />
      </ThemeProvider>
    </HeaderContainer>
  );
}

export default Header;
