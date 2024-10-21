import { styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Serial from '../../../serial';

/* Components */
import Button from '@mui/material/Button';
import { FileBrowser } from '../../FileBrowser';

/* Store */
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setShowFileBrowser } from '../../../store/slices/layout';

/* Styles */
const SerialConnectorContainer = styled('div')`
  display: flex;
  flex-direction: column;

  h1 {
    font-size: 2.2rem;
    font-weight: 500;
    overflow: hidden;
    margin-bottom: 1rem;
  }
`;

const ConnectedLbl = styled('span')`
  color: ${({ theme }) => theme.palette.success.main};

  &.disconnected {
    color: ${({ theme }) => theme.palette.error.main};
  }
`;

const DeviceInfo = styled('div')`
  font-size: 1.6rem;
  margin-left: 1.5rem;
  color: ${({ theme }) => theme.palette.grey[700]};

  &.first {
    margin-top: 1rem;
  }
`;

const DeviceActionContainer = styled('div')`
  margin: 1rem 0px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const DeviceActionButton = styled(Button)`
  margin-left: 1rem;
`;

function SerialConnector() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const isConnected = useAppSelector((state) => state.device.isConnected);
  const deviceInfo = useAppSelector((state) => state.device.deviceInfo);

  const onSerialConnect = () => {
    const serial = Serial.getInstance();
    serial.connect();
  };

  const onRestartCard = () => {
    const serial = Serial.getInstance();
    serial.restartCard();
  };

  const onSerialDisconnect = () => {
    const serial = Serial.getInstance();
    serial.disconnect();
  };

  return (
    <SerialConnectorContainer>
      <h1>
        Device:{' '}
        <ConnectedLbl className={isConnected ? 'connected' : 'disconnected'}>
          {isConnected ? t('menu_device_connected') : t('menu_device_disconnected')}
        </ConnectedLbl>
      </h1>
      {!isConnected && (
        <Button
          variant="contained"
          color="success"
          sx={{
            width: '100%',
            mt: 2,
          }}
          onClick={onSerialConnect}
        >
          {t('button_pair')}
        </Button>
      )}
      {isConnected && (
        <>
          <DeviceInfo className="first">{`Oxocard ${
            deviceInfo.supType
          } ${deviceInfo.uuid.toUpperCase()}`}</DeviceInfo>
          <DeviceInfo>{`FW Version: ${deviceInfo.fwVersion}`}</DeviceInfo>
          <DeviceInfo>{`HW Version: ${deviceInfo.hwVersion}`}</DeviceInfo>
          <DeviceActionContainer>
            <DeviceActionButton onClick={onRestartCard}>{t('button_restart')}</DeviceActionButton>
            <DeviceActionButton
              onClick={() => {
                dispatch(setShowFileBrowser(true));
              }}
            >
              {t('file_browser_title')}
            </DeviceActionButton>
            <FileBrowser />
          </DeviceActionContainer>
          <Button
            variant="outlined"
            color="error"
            sx={{
              width: '100%',
              mt: 2,
            }}
            onClick={onSerialDisconnect}
          >
            {t('button_un_pair')}
          </Button>
        </>
      )}
    </SerialConnectorContainer>
  );
}

export default SerialConnector;
