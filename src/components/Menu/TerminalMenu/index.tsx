import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import Serial from '../../../serial';

/* Components */
import { Checkbox, FormControlLabel, IconButton } from '@mui/material';

/* Store */
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { clearLog } from '../../../store/slices/terminal';

/* Images */
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

/* Styles */
const TerminalWrapper = styled('div')`
  height: 100%;
  overflow: hidden;

  display: flex;
  flex-direction: column;

  h1 {
    font-size: 2.2rem;
    font-weight: 500;
    overflow: hidden;
    margin-bottom: 1rem;
  }
`;

const TerminalInput = styled.div`
  font-size: 1.4rem;
  overflow: visible;
  white-space: nowrap;

  display: flex;

  .timestamp {
    width: 0px;
    color: #505050;
    overflow: hidden;
    transition: width ease-in-out 0.2s;
  }

  .input {
    margin-left: 0.5rem;
    flex: 1;
  }
`;

const TerminalContainer = styled.div`
  flex: 1;
  overflow: auto;

  display: flex;
  flex-direction: column;

  &:hover ${TerminalInput} {
    .timestamp {
      width: 9rem;
    }
  }
`;

const TerminalControls = styled.div`
  margin-top: 2rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Space = styled.div`
  flex: 1;
`;

function TerminalMenu() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const terminalRef = useRef<HTMLDivElement>(null);
  const intervalId = useRef<NodeJS.Timeout | undefined>(undefined);

  const [scroll, setScroll] = useState(true);

  const logs = useAppSelector((state) => state.terminal.logs);

  useEffect(() => {
    const serial = Serial.getInstance();
    serial.enablePrint();
    intervalId.current = setInterval(() => {
      serial.enablePrint();
    }, 120000);
    return () => {
      clearInterval(intervalId.current);
      serial.disablePrint();
    };
  }, [dispatch]);

  useEffect(() => {
    if (scroll && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  });

  const onDownload = () => {
    let logData = '';

    logs.forEach((log) => {
      logData += log.message + '\n';
    });

    if (logData.length) {
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(logData));
      element.setAttribute('download', 'data.txt');

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }
  };

  const getDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = '0' + date.getMinutes();
    const seconds = '0' + date.getSeconds();
    const microseconds = '00' + date.getMilliseconds();
    const formattedTime =
      hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + '.' + microseconds.substr(-3);
    return formattedTime;
  };

  return (
    <TerminalWrapper>
      <h1>{t('menu_terminal_title')}:</h1>
      <TerminalContainer ref={terminalRef}>
        {logs.map((log, i) => (
          <TerminalInput key={i}>
            <div className="timestamp">{getDate(log.timestamp)}</div>
            <div className="input">{log.message}</div>
          </TerminalInput>
        ))}
      </TerminalContainer>
      <TerminalControls>
        <IconButton aria-label="delete" onClick={() => dispatch(clearLog())}>
          <DeleteIcon />
        </IconButton>
        <IconButton aria-label="download" onClick={onDownload}>
          <DownloadIcon />
        </IconButton>
        <Space />
        <FormControlLabel
          control={
            <Checkbox
              checked={scroll}
              onChange={(event) => setScroll(event.target.checked)}
              color="success"
            />
          }
          label={t('menu_terminal_auto_scroll')}
        />
      </TerminalControls>
    </TerminalWrapper>
  );
}

export default TerminalMenu;
