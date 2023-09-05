import styled from 'styled-components';

/* Components */
import ConstantViewer from './ConstantViewer';
import SpriteViewer from './SpriteViewer';

/* Store */

/* Images */

/* Styles */
const VariablesWrapper = styled.div`
  height: 100%;
  overflow: auto;

  display: flex;
  flex-direction: column;
`;

function ConstantsMenu() {
  return (
    <VariablesWrapper>
      <ConstantViewer />
      <SpriteViewer />
    </VariablesWrapper>
  );
}

export default ConstantsMenu;
