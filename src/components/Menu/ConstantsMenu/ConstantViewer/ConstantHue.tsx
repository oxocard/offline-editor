import { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { Constant } from '../../../../types/constants';

/* Components */
import { RgbColorPicker } from 'react-colorful';

/* Store */

/* Interfaces */
interface ConstantHueProps {
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

  .hue_container {
    flex: 1;
    margin-left: 1rem;

    .react-colorful {
      width: 100%;
      height: 30px;
    }
    .react-colorful__saturation {
      display: none;
    }

    .react-colorful__hue {
      height: 20px;
      border-radius: 5px;
    }
  }
`;

function hsv2rgb(hIn: number, s = 1, v = 1) {
  const h = Math.round((hIn / 255) * 360);
  const f = (n: number, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  const rgb = [f(5), f(3), f(1)];
  const r = Math.round(rgb[0] * 255);
  const g = Math.round(rgb[1] * 255);
  const b = Math.round(rgb[2] * 255);
  return { r, g, b };
}

function rgb2hsv(rIn: number, gIn: number, bIn: number, isRight: boolean) {
  const r = rIn / 255.0;
  const g = gIn / 255.0;
  const b = bIn / 255.0;
  const v = Math.max(r, g, b),
    c = v - Math.min(r, g, b);
  const h = c && (v === r ? (g - b) / c : v === g ? 2 + (b - r) / c : 4 + (r - g) / c);
  const hsv = [60 * (h < 0 ? h + 6 : h), v && c / v, v];
  let hue = Math.round((hsv[0] / 360) * 255);
  if (hue === 0 && !isRight) hue = 255;
  return hue;
}

export default function ConstantHue({ constantObject, onValueChange }: ConstantHueProps) {
  const [color, setColor] = useState({ r: 0, g: 255, b: 0 });
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    setColor(hsv2rgb(constantObject.value as number));
  }, [constantObject]);

  return (
    <ConstantContainer>
      <h3>{constantObject.name}</h3>
      <div className="hue_container">
        <RgbColorPicker
          color={color}
          onChange={setColor}
          onMouseUp={(e: React.MouseEvent<HTMLInputElement>) => {
            const element = e.target as HTMLElement;
            setIsChanging(false);
            onValueChange(rgb2hsv(color.r, color.g, color.b, element.offsetLeft < 20));
          }}
          onMouseDown={() => setIsChanging(true)}
          onMouseLeave={(e: React.MouseEvent<HTMLInputElement>) => {
            const element = e.target as HTMLElement;
            if (isChanging)
              onValueChange(rgb2hsv(color.r, color.g, color.b, element.offsetLeft < 20));
            setIsChanging(false);
          }}
        />
      </div>
    </ConstantContainer>
  );
}
