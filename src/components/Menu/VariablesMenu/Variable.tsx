import styled from 'styled-components';

/* Components */

/* Store */

/* Interfaces */
interface VariableProps {
  name: string;
  value: string;
  isBaseType?: boolean;
}

/* Styles */
const VariableWrapper = styled.div`
  height: 3rem;
  overflow: auto;
  border-bottom: 1px solid ${({ theme }) => theme.colors.variableViewVariableBorder};
  font-size: 1.6rem;
  font-weight: 700;

  display: flex;
  align-items: center;

  &.base_type .name {
    color: ${({ theme }) => theme.colors.variableViewVariableBase};
  }

  .name {
    flex: 1;
    color: ${({ theme }) => theme.colors.variableViewVariableName};
    font-weight: 700;
  }

  .value {
    min-width: 10rem;
    max-width: 50%;
    text-align: end;
  }
`;

export default function Variable({ name, value, isBaseType = false }: VariableProps) {
  return (
    <VariableWrapper className={isBaseType ? 'base_type' : ''}>
      <div className="name">{name}</div>
      <div className="value">{value}</div>
    </VariableWrapper>
  );
}
