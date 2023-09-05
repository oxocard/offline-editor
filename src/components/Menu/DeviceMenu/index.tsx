import styled from 'styled-components';

/* Components */
import SerialConnector from './SerialConnector';

/* Store */

/* Styles */
const DeviceWrapper = styled('div')`
  height: 100%;
  overflow: hidden;

  display: flex;
  flex-direction: column;
`;

function DeviceMenu() {
  return (
    <DeviceWrapper>
      <SerialConnector />
    </DeviceWrapper>
  );
}

export default DeviceMenu;
