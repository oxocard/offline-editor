import { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { Constant } from '../../../../types/constants';

/* Components */
import Switch from '@mui/material/Switch';

/* Store */

/* Interfaces */
interface ConstantSwitchProps {
  constantObject: Constant;
  onValueChange: (value: boolean) => void;
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
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export default function ConstantSwitch({ constantObject, onValueChange }: ConstantSwitchProps) {
  const [value, setValue] = useState<boolean>(constantObject.value as boolean);

  const switchLabel = { inputProps: { 'aria-label': 'Switch demo' } };

  useEffect(() => {
    setValue(constantObject.value as boolean);
  }, [constantObject]);

  return (
    <ConstantContainer>
      <h3>{constantObject.name}</h3>
      <Switch
        {...switchLabel}
        size="small"
        checked={value}
        onChange={(event) => {
          onValueChange(event.target.checked);
          setValue(event.target.checked);
        }}
      />
    </ConstantContainer>
  );
}
