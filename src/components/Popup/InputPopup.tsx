/* eslint-disable react-refresh/only-export-components */
import { createRoot } from 'react-dom/client';
import { useEffect, useRef, useState } from 'react';
import { styled, ThemeProvider } from '@mui/material/styles';
import themes from '../../theme';

/* Components */
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

/* Store */
import { store } from '../../store';

/* Interfaces */
interface InputPopupProps {
  initialValue: string;
  options: {
    title?: string;
    acceptText?: string;
    declineText?: string;
    closeOnBackdrop?: boolean;
  };
  onAccept: (result: string) => void;
  onDecline: () => void;
}

/* Styles */
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

const Popup = ({ initialValue, options, onAccept, onDecline }: InputPopupProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const usedTheme = store.getState().layout.theme;

  const [textInputText, setTextInputText] = useState(initialValue);

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
              onAccept(textInputText);
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
              <TextField
                margin="normal"
                variant="standard"
                fullWidth
                value={textInputText}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTextInputText(e.target.value)
                }
              />
            </Typography>
          </CardContent>
          <Action>
            <Button
              color={declineText ? 'success' : 'primary'}
              onClick={() => onAccept(textInputText)}
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

export const showInputPopup = (
  initialValue: string,
  options: InputPopupProps['options'] = {}
): Promise<string | null> => {
  const container = document.getElementById('popup_container');
  const root = createRoot(container!);

  const hidePopup = () => {
    root.unmount();
  };

  return new Promise((resolve) => {
    const onAccept = (result: string) => {
      hidePopup();
      resolve(result);
    };

    const onDecline = () => {
      hidePopup();
      resolve(null);
    };

    root.render(
      <Popup
        initialValue={initialValue}
        options={options}
        onAccept={onAccept}
        onDecline={onDecline}
      />
    );
  });
};
