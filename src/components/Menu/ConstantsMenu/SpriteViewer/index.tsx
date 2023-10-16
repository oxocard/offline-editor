import { ChangeEvent } from 'react';
import styled from 'styled-components';
import { SpriteType } from '../../../../types/sprite';
import { useTranslation } from 'react-i18next';
import * as monaco from 'monaco-editor';
import { generateSprite, getClosestColor } from './spriteHelpers';
import { showPopup } from '../../../Popup';
import type { Color } from './colors';

/* Components */
import Sprite from './Sprite';
import { IconButton } from '@mui/material';
import NewSpriteSettings from './NewSpriteSettings';

/* Store */
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { changeCode } from '../../../../store/slices/editor';

/* Icons */
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';

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

const SpriteHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
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

export default function SpriteViewer() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

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

  const addSpriteToEditor = (sprite: string) => {
    const editor = monaco.editor.getEditors()[0];
    if (!editor) return;
    /* Get the current line of the cursor in the editor */
    const currentLine = editor.getPosition()?.lineNumber || 0;
    /* Get the code and split it into the lines */
    const code = editor.getValue().split('\n');
    /* Add the empty sprite to the code */
    code.splice(currentLine, 0, sprite);
    /* Join the lines back together */
    const newCode = code.join('\n');

    dispatch(changeCode(newCode));
  };

  const onNewSprite = async () => {
    let spriteName = 'newSprite';
    let spriteWidth = 16;
    let spriteHeight = 16;

    const setName = (name: string) => {
      spriteName = name;
    };
    const setWith = (width: number) => {
      spriteWidth = width;
    };
    const setHeight = (height: number) => {
      spriteHeight = height;
    };

    const res = await showPopup(
      <NewSpriteSettings
        setSpriteName={setName}
        setSpriteWidth={setWith}
        setSpriteHeight={setHeight}
      />,
      {
        title: t('menu_constants_new_sprite_popup_title'),
        acceptText: 'Ok',
        declineText: t('button_cancel'),
        closeOnBackdrop: true,
      }
    );

    if (!res) return;
    addSpriteToEditor(generateSprite(spriteName, spriteWidth, spriteHeight));
  };

  const onUploadSprite = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reader = new FileReader();
    /* Set up a callback function to run when the file is loaded */
    reader.onload = function (event) {
      // Create a new image element
      const img = new Image();
      /* Set the source of the image to the loaded data URL */
      img.src = event.target?.result as string;

      /* When the image is loaded, draw it on the canvas */
      img.onload = function () {
        /* Limit the size to 24x24 pixel */
        const MAX_SIZE = 24;
        let imageWidth = img.width;
        let imageHeight = img.height;
        if (imageWidth > imageHeight) {
          if (imageWidth > MAX_SIZE) {
            imageHeight = Math.round(imageHeight * (MAX_SIZE / imageWidth));
            imageWidth = MAX_SIZE;
          }
        } else {
          if (imageHeight > MAX_SIZE) {
            imageWidth = Math.round(imageWidth * (MAX_SIZE / imageHeight));
            imageHeight = MAX_SIZE;
          }
        }
        canvas.width = imageWidth;
        canvas.height = imageHeight;
        ctx.imageSmoothingQuality = 'high';
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, 0, 0, imageWidth, imageHeight);

        /* Get the pixel data from the canvas */
        const pixelData = ctx.getImageData(0, 0, imageWidth, imageHeight).data;
        const spriteData = [];

        /* Loop through the pixel data and get the closest color */
        for (let i = 0; i < pixelData.length; i += 4) {
          const color: Color = [pixelData[i], pixelData[i + 1], pixelData[i + 2]];
          spriteData.push(getClosestColor(color));
        }

        /* Get the name of the file without the file extension */
        const spriteName = file.name
          .replace(/.png|.jpg|.webp/gi, '')
          .replace(/[^a-zA-Z0-9-_]/gi, '_');

        addSpriteToEditor(generateSprite(spriteName, imageWidth, imageHeight, spriteData));
      };
    };

    /* Read the selected file as a data URL*/
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  return (
    <SpriteViewContainer>
      <SpriteHeaderContainer>
        <h1>Sprites:</h1>
        <div>
          <IconButton
            aria-label="delete"
            data-tooltip-id="main-tooltip"
            data-tooltip-content={t('menu_constants_new_sprite')}
            onClick={onNewSprite}
          >
            <AddIcon />
          </IconButton>
          <label htmlFor="upload_sprite">
            <input
              style={{ display: 'none' }}
              id="upload_sprite"
              name="upload_sprite"
              type="file"
              accept=".png,.jpg,.webp"
              onChange={onUploadSprite}
            />
            <IconButton
              aria-label="delete"
              data-tooltip-id="main-tooltip"
              data-tooltip-content={t('menu_constants_upload_sprite')}
              component="span"
            >
              <UploadFileIcon />
            </IconButton>
          </label>
        </div>
      </SpriteHeaderContainer>
      <SpriteListContainer>
        {spriteObjects.length > 0 &&
          spriteObjects.map((sprite, i) => (
            <Sprite key={i} sprite={sprite} onUpdateSprite={onUpdateSprite} />
          ))}
      </SpriteListContainer>
    </SpriteViewContainer>
  );
}
