import styled from 'styled-components';

/* Components */

/* Interfaces */
interface SvgButtonProps {
  id?: string;
  onClick?: () => void;
  active?: boolean;
  activeColor?: string | null;
  disabled?: boolean;
  discreet?: boolean;
  altText?: string;
  children: React.ReactNode;
}

interface ButtonContainerProps {
  activeColor?: string | null;
}

/* Styles */
const ButtonContainer = styled.button<ButtonContainerProps>`
  height: 6rem;
  width: 6rem;
  padding: 0;
  border: none;
  background: none;

  &:hover:not(.disabled) {
    background-color: ${({ theme }) => theme.colors.toolsHeaderButtonBackground};
  }

  &:active:not(.disabled) {
    background-color: ${({ theme }) => theme.colors.toolsHeaderButtonBackground};
    box-shadow: inset 0 0 5px ${({ theme }) => theme.colors.toolsHeaderActiveBorder};
  }

  .svg_icon {
    fill: ${({ theme }) => theme.colors.toolsHeaderButton};
    cursor: pointer;
    outline: none;
  }

  .svg_icon:hover {
    fill: ${({ theme }) => theme.colors.toolsHeaderButtonHover};
  }

  &.active {
    border-bottom: 4px solid
      ${({ theme, activeColor }) =>
        activeColor ? activeColor : theme.colors.toolsHeaderButtonActive};
  }

  &.disabled .svg_icon {
    fill: ${({ theme }) => theme.colors.toolsHeaderButtonDisabled};
    cursor: not-allowed;
  }

  &.discreet .svg_icon {
    fill: ${({ theme }) => theme.colors.toolsHeaderButtonDiscreet};
  }
`;

export default function SvgButton({
  id,
  onClick = () => {},
  active = false,
  activeColor = null,
  disabled = false,
  discreet = false,
  altText = 'SVG Button',
  children,
}: SvgButtonProps) {
  return (
    <ButtonContainer
      id={id}
      className={disabled ? 'disabled' : active ? 'active' : discreet ? 'discreet' : ''}
      aria-label={altText}
      onClick={() => {
        if (!disabled) onClick();
      }}
      activeColor={activeColor}
    >
      {children}
    </ButtonContainer>
  );
}
