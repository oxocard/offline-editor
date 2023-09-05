import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

/* Components */
import Variable from './Variable';
import VariableArray from './VariableArray';

/* Store */
import { useAppSelector } from '../../../store/hooks';

/* Styles */
const VariablesWrapper = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;

  h1 {
    font-size: 2.2rem;
    font-weight: 500;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  h2 {
    color: ${({ theme }) => theme.colors.primary};
    padding: 1rem;
  }
`;

const VariableContainer = styled.div`
  padding: 1rem;
  min-height: 5rem;
  font-size: 1.4rem;
  overflow: auto;
  border-bottom: 1px solid ${({ theme }) => theme.colors.rightMenuNavBackground};

  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

export default function VariableViewer() {
  const { t } = useTranslation();

  const globalVariables = useAppSelector((state) => state.device.globals);
  const localVariables = useAppSelector((state) => state.device.locals);
  const objectVariables = useAppSelector((state) => state.device.objects);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parseVariables = (variables: any, level = 0, prefix = ''): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    let cnt = 0;

    if (
      typeof variables !== 'object' &&
      !Array.isArray(variables) &&
      variables !== null &&
      variables !== undefined
    ) {
      result.push(<Variable key={cnt++} name={''} value={variables} />);
    } else {
      for (const property in variables) {
        const variable = variables[property];
        /* If array */
        if (Array.isArray(variable)) {
          result.push(
            <VariableArray key={cnt++} name={prefix !== '' ? `${prefix}.${property}` : property}>
              {variable.map((element, i) => (
                <div key={i} className="array_element">
                  <div className="array_element_index">{`[${i}]`}</div>
                  <div className="array_element_content">{parseVariables(element, level + 1)}</div>
                </div>
              ))}
            </VariableArray>
          );
        } else if (typeof variable === 'object' && variable !== null) {
          /* If Object */
          /* Loop object */
          result.push(parseVariables(variable, level + 1, property));
        } else {
          /* If it is a normal variable */
          result.push(
            <Variable
              key={cnt++}
              name={prefix !== '' ? `${prefix}.${property}` : property}
              value={variables[property].toString()}
              isBaseType={level === 0}
            />
          );
        }
      }
    }
    return result;
  };

  return (
    <VariablesWrapper id="variable_viewer">
      <h1>{t('menu_variables_title')}:</h1>
      <h2>{t('menu_variables_global')}:</h2>
      <VariableContainer>{parseVariables(globalVariables)}</VariableContainer>
      <h2>{t('menu_variables_local')}:</h2>
      <VariableContainer>{parseVariables(localVariables)}</VariableContainer>
      <h2>{t('menu_variables_Object')}:</h2>
      <VariableContainer>{parseVariables(objectVariables)}</VariableContainer>
    </VariablesWrapper>
  );
}
