import { styled } from '@mui/material';
import { Theme } from '../../theme';
import { useTranslation } from 'react-i18next';
import Serial from '../../serial';

/* Components */

/* Store */
import { useAppSelector } from '../../store/hooks';

/* Images */

/* Styles */
const FooterContainer = styled('div')`
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.mainBackground};
  height: 3rem;
  min-height: 3rem;
  font-size: 1.6rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DeviceWrapper = styled('div')`
  margin-left: 1rem;

  display: flex;
  align-items: baseline;

  .uuid_short {
    margin-left: 0.5rem;
    color: ${({ theme }) => theme.palette.grey[600]};
  }
`;

const StateWrapper = styled('div')`
  padding: 0px 1rem;
  margin-right: 1rem;

  display: flex;
  align-items: center;

  &.connected {
    background-color: green;
  }
  &.disconnected {
    background-color: red;
  }
`;

const ConnectButton = styled('button')`
  padding: 0;
  border: none;
  background: none;
  margin-left: 0.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: 1.6rem;
  font-weight: 700;
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.palette.text.primary};
  }

  &:active {
    font-size: 1.4rem;
    margin-left: 0.6rem;
    margin-bottom: 0.1rem;
  }
`;

const ErrorWrapper = styled('div')`
  height: 100%;
  width: 100%;
  background-color: #e5006d;
  padding-left: 2rem;

  display: flex;
  align-items: center;
`;

function Footer() {
  const { t } = useTranslation();

  const error = useAppSelector((state) => state.editor.error);
  const isConnected = useAppSelector((state) => state.device.isConnected);
  const deviceInfo = useAppSelector((state) => state.device.deviceInfo);

  const onSerialConnect = () => {
    const serial = Serial.getInstance();
    serial.connect();
  };

  return (
    <FooterContainer>
      {!error && (
        <DeviceWrapper id="footer_device">
          <StateWrapper
            data-cy="oxocard_state"
            className={isConnected ? 'connected' : 'disconnected'}
          >
            {isConnected ? t('footer_state_connected') : t('footer_state_disconnected')}
          </StateWrapper>
          {!isConnected && (
            <ConnectButton onClick={onSerialConnect}>{t('button_pair')}</ConnectButton>
          )}
          {isConnected && deviceInfo.uuid && (
            <>
              {`Oxocard ${deviceInfo.supType}`}
              <span data-cy="oxocard_uuid" className="uuid_short">
                {deviceInfo.uuid.toUpperCase()}
              </span>
            </>
          )}
        </DeviceWrapper>
      )}
      {error && <ErrorWrapper>{error.message}</ErrorWrapper>}
    </FooterContainer>
  );
}

export default Footer;
