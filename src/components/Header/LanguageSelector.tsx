import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material';

/* Store */
import { useAppDispatch } from '../../store/hooks';
import { setLanguage } from '../../store/slices/client';

/* Components */
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

/* Styles */
const LanugageSelector = styled('div')`
  padding: 0.6rem 1.6rem;
`;

const LanguageSelector = () => {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();

  const onSetLanguage = (language: 'de' | 'en' | 'fr') => {
    dispatch(setLanguage(language));
    i18n.changeLanguage(language);
  };

  return (
    <LanugageSelector>
      <ButtonGroup
        fullWidth
        disableRipple
        disableElevation
        size="small"
        aria-label="Language selection"
      >
        <Button
          color="success"
          variant={i18n.language === 'de' ? 'contained' : 'outlined'}
          onClick={() => onSetLanguage('de')}
        >
          DE
        </Button>
        <Button
          color="success"
          variant={i18n.language === 'en' ? 'contained' : 'outlined'}
          onClick={() => onSetLanguage('en')}
        >
          EN
        </Button>
        <Button
          color="success"
          variant={i18n.language === 'fr' ? 'contained' : 'outlined'}
          onClick={() => onSetLanguage('fr')}
        >
          FR
        </Button>
      </ButtonGroup>
    </LanugageSelector>
  );
};

export default LanguageSelector;
