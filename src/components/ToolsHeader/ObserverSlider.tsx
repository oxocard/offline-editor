import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

/* Components */
import Popper from '@mui/material/Popper';
import Slider from '@mui/material/Slider';

/* Store */

/* Interfaces */
interface ObserverSliderProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  defaultValue: number;
  onChange: (value: number) => void;
}

/* Styles */
const SliderContainer = styled('div')`
  width: 20rem;
  margin-left: 2rem;

  h1 {
    color: ${({ theme }) => theme.palette.text.primary};
    margin-top: 1rem;
    font-size: 1.2rem;
  }
`;

const ObserverSlider = ({ anchorEl, open, defaultValue, onChange }: ObserverSliderProps) => {
  const { t } = useTranslation();

  const [value, setValue] = useState(11 - defaultValue / 100);

  return (
    <Popper open={open} anchorEl={anchorEl} placement="right">
      <SliderContainer>
        <h1>{t('tools_header_btn_debug_observe_slider')}</h1>
        <Slider
          aria-label="Observer Speed"
          value={value}
          step={1}
          marks
          min={1}
          max={10}
          onChangeCommitted={(_e, value) => onChange(1100 - (value as number) * 100)}
          onChange={(_e, value) => setValue(value as number)}
          size="small"
          color="secondary"
        />
      </SliderContainer>
    </Popper>
  );
};

export default ObserverSlider;
