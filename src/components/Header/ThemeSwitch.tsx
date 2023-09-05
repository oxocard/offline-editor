import { useTranslation } from 'react-i18next';

/* Components */
import { IconButton, styled } from '@mui/material';

/* Images */
import LightModeIcon from '@mui/icons-material/LightMode';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

/* Store */
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setTheme } from '../../store/slices/layout';

/* Styles */
const DakModeButton = styled(IconButton)`
  color: #ffffff;
`;

function ThemeSwitcher() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const usedTheme = useAppSelector((state) => state.layout.theme);

  return (
    <div data-tooltip-id="main-tooltip" data-tooltip-content={t('header_theme_switch')}>
      {usedTheme === 'light' ? (
        <DakModeButton
          color="#ffffff"
          aria-label="dark mode"
          onClick={() => dispatch(setTheme('dark'))}
        >
          <LightModeOutlinedIcon />
        </DakModeButton>
      ) : (
        <IconButton aria-label="light mode" onClick={() => dispatch(setTheme('light'))}>
          <LightModeIcon />
        </IconButton>
      )}
    </div>
  );
}

export default ThemeSwitcher;
