import { useState, useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import { SpriteType } from '../../../../types/sprite';
import colors from './colors';

/* Components */
import Menu from '@mui/material/Menu';

/* Store */

/* Interfaces */
interface ColorProps {
  value: number;
}

interface SpriteCanvasProps {
  width: string;
  height: string;
}

interface SpriteEditorProps {
  sprite: SpriteType;
  onUpdateSprite: (sprite: SpriteType) => void;
}

/* Styles */
const SpritesEditorContainer = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.contentBackground};

  display: flex;
  align-items: flex-start;
`;

const ToolsContainer = styled.div`
  width: 3rem;
  margin-right: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const ColorPickerContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColorPicker = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  border: 1px solid white;
  cursor: pointer;
  image-rendering: pixelated;
  background-image: url(/assets/images/color_picker_background.png);
  background-size: contain;
`;

const ColorsContainer = styled.div`
  width: 30rem;
  aspect-ratio: 1/1;

  display: grid;
  grid-template-columns: repeat(16, 1fr);
  grid-template-rows: repeat(16, 1fr);
`;

const Color = styled.div<ColorProps>`
  cursor: pointer;
  image-rendering: pixelated;
  background-size: 800%;
  background-color: ${({ value }) =>
    `rgb(${colors[value][0]},${colors[value][1]},${colors[value][2]})`};
  background-image: ${({ value }) =>
    value === 0 ? 'url(/assets/images/canvas_background.png)' : 'none'};

  &:hover {
    border: 1px solid white;
  }
`;

const Swatch = styled.div<ColorProps>`
  width: 100%;
  aspect-ratio: 1/1;
  background-color: ${({ value }) =>
    `rgb(${colors[value][0]},${colors[value][1]},${colors[value][2]})`};
  margin-top: 0.5rem;
  border: 1px solid ${({ theme }) => theme.palette.text.primary};
  cursor: pointer;

  &.transparent {
    image-rendering: pixelated;
    background-image: url(/assets/images/canvas_background.png);
    background-size: 800%;
    margin-bottom: 1rem;
  }
`;

const SpriteCanvas = styled.canvas<SpriteCanvasProps>`
  width: ${({ width }) => `calc(100% /24 * ${+width.replace('px', '')})`};
  aspect-ratio: ${({ width, height }) =>
    `${+width.replace('px', '')}/${+height.replace('px', '')}`};
  border: 1px solid white;
  image-rendering: pixelated;
  background-image: url(/assets/images/canvas_background.png);
  background-size: 30rem;
`;

function getMousePos(
  canvas: HTMLCanvasElement,
  evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  width: number
) {
  const rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;

  let x = Math.floor((evt.clientX - rect.left) * scaleX);
  let y = Math.floor((evt.clientY - rect.top) * scaleY);

  if (x < 0) x = 0;
  if (y < 0) y = 0;

  return y * width + x;
}

function getImage(ctx: CanvasRenderingContext2D, sprite: SpriteType) {
  const spriteData = sprite.data;
  /* Create a new image data and get the data array */
  const imgData = ctx.createImageData(sprite.sizeX, sprite.sizeY);
  const data = imgData.data;

  /* set every pixel in the image with the sprite colors */
  for (const i in spriteData) {
    data[+i * 4] = colors[spriteData[i]][0];
    data[+i * 4 + 1] = colors[spriteData[i]][1];
    data[+i * 4 + 2] = colors[spriteData[i]][2];
    data[+i * 4 + 3] = spriteData[i] === 0 ? 0 : 255;
  }

  return imgData;
}

/* Function to get the top 5 most used colors in the sprite */
function calculateFavColors(data: number[]): number[] {
  const counts: { [key: number]: number } = {};
  /* Add empty colors, in case less than 5 colors are present in the sprite */
  counts[160] = 1.5; //red
  counts[150] = 1.4; //green
  counts[170] = 1.3; //blue
  counts[15] = 1.2; //white
  counts[1] = 1.1; //black
  /* Calculate the number of occurrences for every color */
  for (const num of data) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }
  /* remove the transparent color value 0 */
  delete counts[0];
  /* make a sortable array of the counts object */
  const sortable: [number, number][] = [];
  for (const e in counts) {
    sortable.push([parseInt(e), counts[e]]);
  }
  sortable.sort(function (a, b) {
    return b[1] - a[1];
  });
  /* return the 5 most used color values */
  return [sortable[0][0], sortable[1][0], sortable[2][0], sortable[3][0], sortable[4][0]];
}

export default function SpriteEditor({ sprite, onUpdateSprite }: SpriteEditorProps) {
  /* Refs for the canvas */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [color, setColor] = useState(77);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const colorPickeropen = Boolean(anchorEl);

  /* draw the images every time the sprite changes */
  useLayoutEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      /* Put the image in the canvas */
      ctx.putImageData(getImage(ctx, sprite), 0, 0);
    }
  }, [sprite]);

  let lastPos = -1;
  let isMouseDown = false;

  function onCanvasMouseMove(evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (!canvasRef.current) return;
    const pos = getMousePos(canvasRef.current, evt, sprite.sizeX); // get adjusted coordinates as above

    if (lastPos !== pos) {
      if (isMouseDown) {
        sprite.data[pos] = color;
      }

      /* add the cursor to the image */
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      const img = getImage(ctx, sprite);
      img.data[pos * 4] = colors[color][0];
      img.data[pos * 4 + 1] = colors[color][1];
      img.data[pos * 4 + 2] = colors[color][2];
      img.data[pos * 4 + 3] = 255;
      ctx.putImageData(img, 0, 0);

      lastPos = pos;
    }
  }

  function onCanvasMouseLeave() {
    /* Get she image and put it in the canvas */
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.putImageData(getImage(ctx, sprite), 0, 0);
    lastPos = -1;
  }

  function onCanvasMouseDown(evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    isMouseDown = true;
    if (!canvasRef.current) return;
    const pos = getMousePos(canvasRef.current, evt, sprite.sizeX);
    sprite.data[pos] = color;
  }

  function onCanvasMouseUp() {
    isMouseDown = false;
    onUpdateSprite(sprite);
  }

  function handleClick(evt: React.MouseEvent<HTMLDivElement>) {
    setAnchorEl(evt.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function onColorSelect(colorValue: number) {
    setColor(colorValue);
    setAnchorEl(null);
  }

  const favColors = calculateFavColors(sprite.data);

  return (
    <SpritesEditorContainer>
      <ToolsContainer>
        <ColorPickerContainer>
          <ColorPicker id="color_picker" onClick={handleClick} />
          <Menu
            id="color_picker-menu"
            anchorEl={anchorEl}
            open={colorPickeropen}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'color_picker',
            }}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <ColorsContainer>
              {colors.map((_color, i) => (
                <Color key={i} value={i} onClick={() => onColorSelect(i)} />
              ))}
            </ColorsContainer>
          </Menu>
          <Swatch className="transparent" value={0} onClick={() => setColor(0)} />
          <Swatch value={favColors[0]} onClick={() => setColor(favColors[0])} />
          <Swatch value={favColors[1]} onClick={() => setColor(favColors[1])} />
          <Swatch value={favColors[2]} onClick={() => setColor(favColors[2])} />
          <Swatch value={favColors[3]} onClick={() => setColor(favColors[3])} />
          <Swatch value={favColors[4]} onClick={() => setColor(favColors[4])} />
        </ColorPickerContainer>
      </ToolsContainer>
      <SpriteCanvas
        ref={canvasRef}
        width={`${sprite.sizeX}px`}
        height={`${sprite.sizeY}px`}
        onMouseMove={onCanvasMouseMove}
        onMouseLeave={onCanvasMouseLeave}
        onMouseDown={onCanvasMouseDown}
        onMouseUp={onCanvasMouseUp}
      ></SpriteCanvas>
    </SpritesEditorContainer>
  );
}
