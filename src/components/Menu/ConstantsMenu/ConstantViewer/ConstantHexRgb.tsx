import { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { Constant } from '../../../../types/constants';

/* Components */
import { HexColorPicker } from 'react-colorful';

/* Store */

/* Interfaces */
interface ConstantHexRgbProps {
  constantObject: Constant;
  onValueChange: (value: string) => void;
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

  .hue_container {
    flex: 1;
    margin-left: 1rem;

    .react-colorful {
      width: 100%;
      height: 80px;
    }

    .react-colorful__hue {
      height: 10px;
    }
  }
`;

export default function ConstantHexRgb({ constantObject, onValueChange }: ConstantHexRgbProps) {
  const [color, setColor] = useState('#FF0000');

  useEffect(() => {
    const val = constantObject.value as string;
    setColor(val.replace('0x', '#'));
  }, [constantObject]);

  return (
    <ConstantContainer>
      <h3>{constantObject.name}</h3>
      <div className="hue_container">
        <HexColorPicker
          color={color}
          onChange={setColor}
          onMouseUp={() => onValueChange(color.toUpperCase().replace('#', '0x'))}
          onMouseLeave={() => onValueChange(color.toUpperCase().replace('#', '0x'))}
        />
      </div>
    </ConstantContainer>
  );
}

// onMouseUp={() => onValueChange()}
