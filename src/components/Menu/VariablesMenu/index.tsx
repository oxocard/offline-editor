import styled from 'styled-components';

/* Components */
import VariableViewer from './VariableViewer';

/* Store */

/* Styles */
const VariablesWrapper = styled.div`
  height: 100%;
  overflow: auto;

  display: flex;
  flex-direction: column;
`;

function VariablesMenu() {
  return (
    <VariablesWrapper>
      <VariableViewer />
    </VariablesWrapper>
  );
}

export default VariablesMenu;
