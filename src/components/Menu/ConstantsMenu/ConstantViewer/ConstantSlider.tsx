import { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { Constant } from '../../../../types/constants';

/* Components */
import Slider from '@mui/material/Slider';

/* Store */

/* Interfaces */
interface ConstantSliderProps {
  constantObject: Constant;
  onValueChange: (value: number) => void;
}

/* Styles */
const ConstantContainer = styled.div`
  padding: 0.5rem 0px 0.5rem 1.1rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin-left: -1rem;
    min-width: 50%;
    max-width: 70%;
    color: ${({ theme }) => theme.colors.primary};
    overflow: hidden;
  }

  .slider_container {
    flex: 1;
    margin-left: 1rem;
  }
`;

export default function ConstantSlider({ constantObject, onValueChange }: ConstantSliderProps) {
  const [value, setValue] = useState<number>(constantObject.value as number);

  useEffect(() => {
    setValue(constantObject.value as number);
  }, [constantObject]);

  return (
    <ConstantContainer>
      <h3>{constantObject.name}</h3>
      <div className="slider_container">
        <Slider
          size="small"
          aria-label="Constant slider"
          value={value}
          step={
            constantObject.type === 'float'
              ? Math.round(((constantObject.range.to! - constantObject.range.from!) / 100) * 100) /
                  100 <=
                0
                ? 0.01
                : Math.round(
                    ((constantObject.range.to! - constantObject.range.from!) / 100) * 100
                  ) / 100
              : 1
          }
          min={constantObject.range.from}
          max={constantObject.range.to}
          valueLabelDisplay="auto"
          onChange={(_e, value) => setValue(value as number)}
          onChangeCommitted={() => onValueChange(value as number)}
        />
      </div>
    </ConstantContainer>
  );
}
