import styled from 'styled-components';

/* Components */
import ConstantViewer from './ConstantViewer';
import SpriteViewer from './SpriteViewer';

/* Store */

/* Images */

/* Styles */
const ConstantsWrapper = styled.div`
  height: 100%;
  overflow: auto;
  overflow-x: hidden;

  display: flex;
  flex-direction: column;
`;

function ConstantsMenu() {
  return (
    <ConstantsWrapper>
      <ConstantViewer />
      <SpriteViewer />
    </ConstantsWrapper>
  );
}

export default ConstantsMenu;
