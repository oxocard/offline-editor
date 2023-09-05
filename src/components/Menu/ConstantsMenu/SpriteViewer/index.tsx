import styled from 'styled-components';
import { SpriteType } from '../../../../types/sprite';

/* Components */
import Sprite from './Sprite';

/* Store */
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { changeCode } from '../../../../store/slices/editor';

/* Styles */
const SpriteViewContainer = styled.div`
  margin-top: 2rem;
  padding-right: 2rem;
  flex: 1;

  display: flex;
  flex-direction: column;

  h1 {
    font-size: 2.2rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }
`;

const SpriteListContainer = styled.div`
  margin-top: 1rem;

  display: flex;
  flex-direction: column;
`;

const codeToSpriteObjects = (code: string): SpriteType[] => {
  /* Get all lines starting with the word const*/
  const sprites = code.match(/# ?image *\n.+:byte\[\d{1,2}\*\d{1,2}\] = \[/g);
  if (sprites) {
    const SpriteObject = sprites.map((s) => {
      /* Get the sprites name */
      let name = s.match(/.+:byte/)?.at(0) || '';
      if (name) name = name.replace(':byte', '');
      else return null;

      /* Get the sprites dimensions */
      const dim = s.match(/\[\d{1,2}\*\d{1,2}\]/);
      if (!dim) return null;
      const dimensions = dim[0].replace('[', '').replace(']', '');
      /* Get the x and y size */
      const sizeStrings = dimensions.split('*');
      const sizes = [+sizeStrings[0], +sizeStrings[1]];

      /* Check the dimensions are between 1 and 24 */
      if (sizes[0] > 24 || sizes[0] <= 0 || sizes[1] > 24 || sizes[1] <= 0) return null;

      /* Get the array */
      const pattern = new RegExp(name + `:byte\\[${sizes[0]}\\*${sizes[1]}\\] = \\[[\n 0-9,]+`);
      let arrayString = code.match(pattern)?.at(0) || '';

      if (!arrayString) {
        return null;
      }

      arrayString = arrayString
        .replace(`${name}:byte[${sizes[0]}*${sizes[1]}] = [`, '')
        .replaceAll(' ', '')
        .replaceAll('\n', '');
      const spriteArray = arrayString.split(',').map((e) => +e);

      /* Check if the array length matches the dimensions */
      if (spriteArray.length !== sizes[0] * sizes[1]) {
        return null;
      }
      /* Check if all values are in the range 0-255 */
      if (spriteArray.some((e) => e < 0 || e > 255)) {
        return null;
      }

      return { name, data: spriteArray, sizeX: sizes[0], sizeY: sizes[1] };
    });
    /* Only return non null elements in the array */
    return SpriteObject.reduce<SpriteType[]>((acc, curr) => {
      if (curr) acc.push(curr);
      return acc;
    }, []);
  } else {
    return [];
  }
};

/* Time in ms to pass without any change for the editor to run the script */
// const RUN_DEBOUNCE_MS = 1500;

export default function SpriteViewer() {
  const dispatch = useAppDispatch();

  // const runTimeoutId = useRef(null);

  const code = useAppSelector((state) => state.editor.code);
  const spriteObjects = codeToSpriteObjects(code) || [];

  function onUpdateSprite(sprite: SpriteType) {
    let arrayString = '';
    for (const b in sprite.data) {
      arrayString += sprite.data[b] + ',';
      if (((+b + 1) % sprite.sizeX === 0 && +b > 0) || sprite.sizeX === 1) {
        arrayString += '\n';
      }
    }

    arrayString = arrayString.slice(0, -2);

    const imgString = `${sprite.name}:byte[${sprite.sizeX}*${sprite.sizeY}] = [\n${arrayString}\n]`;

    const pattern = new RegExp(`${sprite.name}:byte.+?(?:]$)`, 'gms');

    const newCode = code.replace(pattern, imgString);

    dispatch(changeCode(newCode));
  }

  return (
    <SpriteViewContainer>
      <h1>Sprites:</h1>
      <SpriteListContainer>
        {spriteObjects.length > 0 &&
          spriteObjects.map((sprite, i) => (
            <Sprite key={i} sprite={sprite} onUpdateSprite={onUpdateSprite} />
          ))}
      </SpriteListContainer>
    </SpriteViewContainer>
  );
}
