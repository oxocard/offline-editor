import { useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Serial from '../../../../serial';
import type { Constant } from '../../../../types/constants';

/* Components */
import ConstantSlider from './ConstantSlider';
import ConstantSwitch from './ConstantSwitch';
import ConstantHue from './ConstantHue';
import ConstantHexRgb from './ConstantHexRgb';

/* Store */
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { changeCode } from '../../../../store/slices/editor';

/* Styles */
const ConstantsWrapper = styled.div`
  flex-shrink: 0;
  padding: 0px 1rem 1rem 0rem;
  min-height: 5rem;
  /* font-size: 1.4rem; */
  overflow: hidden;
  border-bottom: 1px solid ${({ theme }) => theme.colors.mainBackground};
  overflow: visible;

  display: flex;
  flex-direction: column;

  h1 {
    font-size: 2.2rem;
    font-weight: 500;
    overflow: hidden;
    margin-bottom: 1rem;
  }
`;

const codeToConstObjects = (code: string): Constant[] => {
  /* Get all lines starting with the word const*/
  const cons = code.match(/const ?.+/g);
  if (cons) {
    const constantObject = cons.map((c) => {
      let type;
      let range: Constant['range'] = {};
      let value;
      let valueString = '';
      /* Get the constants name */
      let name = c.match(/const [a-zA-Z_0-9]+/)?.at(0) || '';
      if (name) name = name.replace('const ', '');
      else return null;

      const hexRgb = c.match(/= 0x([A-F0-9]{6})/);
      if (hexRgb) {
        if (c.match(/# (HEX_RGB)/)) {
          valueString = hexRgb[0].replace('= ', '');
          value = valueString;
          type = 'hexRgb';
        } else {
          return null;
        }
      } else {
        /* Get the constants value */
        value = c.match(/= [+-]?([0-9]*[.])?[0-9]+/);
        /* check if it is a number */
        if (value) {
          valueString = value[0].replace('= ', '') || '';
          value = +valueString;
          /* Differentiate between numbers and floats */
          if (c.match(/# [-]?[0-9]+[ ]?..[ ]?[-]?[0-9]+/)) {
            type = 'number';
          } else if (c.match(/# [-]?([0-9]*[.])?[0-9]+[ ]?..[ ]?[-]?([0-9]*[.])?[0-9]+/)) {
            type = 'float';
          } else if (c.match(/# (HUE)/)) {
            type = 'hue';
          } else {
            return null;
          }
          if (type === 'number' || type === 'float') {
            /* Get the minimal and maximal values */
            const ranges = c
              ?.match(/# [-]?([0-9]*[.])?[0-9]+[ ]?..[ ]?[-]?([0-9]*[.])?[0-9]+/)
              ?.at(0)
              ?.replace('# ', '')
              .split('..');
            if (
              !ranges ||
              !ranges.length ||
              Number.isNaN(+ranges[0]) ||
              Number.isNaN(+ranges[1]) ||
              +ranges[0] > +ranges[1]
            )
              return null;
            range = { from: +ranges[0], to: +ranges[1] };
          }
        } else {
          /* If it is not a number, check if it is a boolean */
          value = c.match(/= (true|false){1}/);
          type = 'boolean';
          if (value?.length) value = value[0].replace('= ', '') === 'true';
          else return null;
        }
      }

      return { type, name, value, valueString, range, line: c };
    });
    /* Only return non null elements in the array */
    return constantObject.reduce<Constant[]>((acc, curr) => {
      if (curr) acc.push(curr);
      return acc;
    }, []);
  } else {
    return [];
  }
};

/* Time in ms to pass without any change for the editor to run the script */
const RUN_DEBOUNCE_MS = 1500;

export default function ConstantViewer() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const runTimeoutId = useRef<NodeJS.Timeout | undefined>(undefined);

  const code = useAppSelector((state) => state.editor.code);
  const constantObjects = codeToConstObjects(code);

  const changeConstant = (constant: Constant, value: Constant['value']) => {
    const currentValueString = `${constant.valueString || constant.value}`;
    const newValueString = `${value}`;
    const newLine = constant.line.replace(currentValueString, newValueString);
    const newCode = code.replace(constant.line, newLine);
    dispatch(changeCode(newCode));

    /* Debouncing change event handler */
    clearTimeout(runTimeoutId.current);
    runTimeoutId.current = setTimeout(() => {
      const serial = Serial.getInstance();
      serial.sendCode();
    }, RUN_DEBOUNCE_MS);
  };

  return (
    <ConstantsWrapper>
      <h1>{t('menu_constants_title')}:</h1>
      {(constantObjects.length &&
        constantObjects.map((c, i) => {
          if (c && (c.type === 'number' || c.type === 'float')) {
            return (
              <ConstantSlider
                key={i}
                constantObject={c}
                onValueChange={(value) => changeConstant(c, value)}
              />
            );
          } else if (c && c.type === 'boolean') {
            return (
              <ConstantSwitch
                key={i}
                constantObject={c}
                onValueChange={(value) => changeConstant(c, value)}
              />
            );
          } else if (c && c.type === 'hue') {
            return (
              <ConstantHue
                key={i}
                constantObject={c}
                onValueChange={(value) => changeConstant(c, value)}
              />
            );
          } else if (c && c.type === 'hexRgb') {
            return (
              <ConstantHexRgb
                key={i}
                constantObject={c}
                onValueChange={(value) => changeConstant(c, value)}
              />
            );
          } else {
            return null;
          }
        })) ||
        null}
    </ConstantsWrapper>
  );
}

//
