import { createRoot } from 'react-dom/client';
import { useEffect, useRef, ReactNode } from 'react';
import { styled, ThemeProvider } from '@mui/material/styles';
import themes from '../../theme';

/* Components */
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

/* Store */
import { store } from '../../store';

/* Interfaces */
interface PopupProps {
  content: ReactNode;
  options: {
    title?: string;
    acceptText?: string;
    declineText?: string;
    closeOnBackdrop?: boolean;
  };
  onAccept: () => void;
  onDecline: () => void;
}

/* Styles */
const Container = styled('div')`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0px;
  left: 0px;
  pointer-events: none;
  z-index: 99;
`;

const Backdrop = styled('div')`
  width: 100%;
  height: 100%;
  background-color: #0008;
  pointer-events: auto;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Action = styled(CardActions)`
  justify-content: flex-end;
`;

const Popup = ({ content, options, onAccept, onDecline }: PopupProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const usedTheme = store.getState().layout.theme;

  const { title = '', acceptText = 'OK', declineText, closeOnBackdrop = false } = options;

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.focus();
    }
  }, [cardRef]);

  return (
    <ThemeProvider theme={themes[usedTheme]}>
      <Backdrop onClick={closeOnBackdrop ? onDecline : null}>
        <Card
          tabIndex={-1}
          ref={cardRef}
          sx={{ minWidth: '50rem' }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onAccept();
              e.stopPropagation();
            } else if (e.key === 'Esc' || e.key === 'Escape') {
              onDecline();
              e.stopPropagation();
            } else if (e.key === 'Tab') {
              e.stopPropagation();
            }
          }}
        >
          <CardContent>
            {title && (
              <Typography gutterBottom variant="h5" component="div">
                {title}
              </Typography>
            )}
            {title && <Divider />}
            <Typography sx={{ marginTop: '1rem' }} component="div">
              {content}
            </Typography>
          </CardContent>
          <Action>
            <Button
              color={declineText ? 'success' : 'primary'}
              onClick={onAccept}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                }
              }}
            >
              {acceptText}
            </Button>
            {declineText && (
              <Button
                color="error"
                onClick={onDecline}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.stopPropagation();
                  }
                }}
              >
                {declineText}
              </Button>
            )}
          </Action>
        </Card>
      </Backdrop>
    </ThemeProvider>
  );
};

export const PopupContainer = () => {
  return <Container id="popup_container"></Container>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const showPopup = (content: ReactNode, options: PopupProps['options'] = {}) => {
  const container = document.getElementById('popup_container');
  const root = createRoot(container!);

  const hidePopup = () => {
    root.unmount();
  };

  return new Promise((resolve) => {
    const onAccept = () => {
      hidePopup();
      resolve(true);
    };

    const onDecline = () => {
      hidePopup();
      resolve(false);
    };

    root.render(
      <Popup content={content} options={options} onAccept={onAccept} onDecline={onDecline} />
    );
  });
};
