import { useState } from 'react';
import styled from 'styled-components';

/* Components */

/* Store */

/* Interfaces */
interface VariableArrayProps {
  name: string;
  children: React.ReactNode;
}

/* Styles */
const ArrayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0.5rem 0px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.variableViewVariableBorder};

  .header {
    display: flex;
    align-items: baseline;

    .icon {
      width: 2rem;
      height: 2rem;
      margin-bottom: 0.5rem;
      background-color: gainsboro;
      color: black;
      cursor: pointer;
      font-size: 2.1rem;
      font-weight: 700;
      user-select: none;

      display: flex;
      align-items: center;
      justify-content: center;
    }

    .name {
      margin-left: 1rem;
      font-size: 1.8rem;
      color: ${({ theme }) => theme.colors.variableViewArrayName};
    }
  }

  .content {
    margin-left: 0.75rem;
    padding-left: 1.25rem;
    border-left: 1px solid ${({ theme }) => theme.colors.variableViewVariableBorder};
    max-height: 500rem;
    transition: max-height 0.2s ease-out;
    overflow: hidden;

    &.closed {
      max-height: 0px;
    }

    .array_element {
      &_index {
        margin-top: 1rem;
        font-size: 1.8rem;
        color: ${({ theme }) => theme.colors.variableViewArrayName};
      }
    }
  }
`;

export default function Array({ name, children }: VariableArrayProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ArrayWrapper>
      <div className="header">
        <div className="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '−' : '+'}
        </div>
        <div className="name">{name}</div>
      </div>
      <div className={isOpen ? 'content open' : 'content closed'}>{children}</div>
    </ArrayWrapper>
  );
}
