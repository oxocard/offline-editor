import { useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { SpriteType } from '../../../../types/sprite';
import { Theme } from '../../../../theme';
import colors from './colors';

/* Components */
import SpriteEditor from './SpriteEditor';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';

/* Store */

/* Interfaces */
interface SpriteProps {
  sprite: SpriteType;
  onUpdateSprite: (sprite: SpriteType) => void;
}

/* Styles */
const SpritesContainer = styled.div`
  padding: 1rem;
  margin-bottom: 2rem;
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.contentBackground};

  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .preview {
    display: flex;
  }
`;

const SpriteContainer = styled.div`
  margin-top: 1rem;
  margin-left: 1rem;

  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .name {
    font-size: 1.4rem;
  }
`;

const SpriteCanvas = styled.canvas`
  width: ${({ width }) => `calc(${width} + 2px)`};
  aspect-ratio: ${({ width = '10px', height = '10px' }: { width: string; height: string }) =>
    `${+width.replace('px', '')}/${+height.replace('px', '')}`};
  /* border: 1px solid white; */
  outline: 1px solid ${({ theme }: { theme: Theme }) => theme.palette.text.primary};
  image-rendering: pixelated;
  background-image: url(/assets/images/canvas_background.png);
  background-size: 3rem;

  &.x2 {
    width: ${({ width }) => `calc(${+width.replace('px', '') * 2}px + 2px)`};
    background-size: 6rem;
  }

  &.x4 {
    width: ${({ width }) => `calc(${+width.replace('px', '') * 4}px + 2px)`};
    background-size: 12rem;
  }
`;

const Name = styled.h2`
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.toolsHeaderBackground};
  color: ${({ theme }: { theme: Theme }) => theme.palette.text.primary};

  display: flex;
  justify-content: space-between;

  .resolution {
    color: ${({ theme }: { theme: Theme }) => theme.palette.text.primary};
  }
`;

const EditButton = styled(Button)`
  margin-right: 2rem;
`;

export default function Sprite({ sprite, onUpdateSprite }: SpriteProps) {
  const [editorOpen, setEditorOpen] = useState(false);

  /* Refs for the canvas */
  const x1CanvasRef = useRef<HTMLCanvasElement>(null);
  const x2CanvasRef = useRef<HTMLCanvasElement>(null);
  const x4CanvasRef = useRef<HTMLCanvasElement>(null);

  /* draw the images every time the sprite changes */
  useLayoutEffect(() => {
    const ctxX1 = x1CanvasRef.current!.getContext('2d');
    const ctxX2 = x2CanvasRef.current!.getContext('2d');
    const ctxX4 = x4CanvasRef.current!.getContext('2d');

    /* Create a new image data and get the data array */
    const imgData = ctxX1!.createImageData(sprite.sizeX, sprite.sizeY);
    const data = imgData.data;

    /* set every pixel in the image with the sprite colors */
    for (const i in sprite.data) {
      data[+i * 4] = colors[sprite.data[i]][0];
      data[+i * 4 + 1] = colors[sprite.data[i]][1];
      data[+i * 4 + 2] = colors[sprite.data[i]][2];
      data[+i * 4 + 3] = sprite.data[i] === 0 ? 0 : 255;
    }

    /* Put the image in the first canvas */
    ctxX1!.putImageData(imgData, 0, 0);

    ctxX2!.clearRect(0, 0, sprite.sizeX, sprite.sizeY);
    ctxX4!.clearRect(0, 0, sprite.sizeX, sprite.sizeY);

    /* Draw the first canvas as an image into the scaled versions */
    ctxX2!.drawImage(x1CanvasRef.current!, 0, 0);
    ctxX4!.drawImage(x1CanvasRef.current!, 0, 0);
  }, [sprite]);

  return (
    <>
      <Name>
        <>{sprite.name}</>
        <span className="resolution">{`${sprite.sizeX}x${sprite.sizeY} Pixel`}</span>
      </Name>
      {editorOpen && <SpriteEditor sprite={sprite} onUpdateSprite={onUpdateSprite} />}
      <SpritesContainer>
        {!editorOpen && (
          <EditButton variant="text" startIcon={<EditIcon />} onClick={() => setEditorOpen(true)}>
            Edit
          </EditButton>
        )}
        {editorOpen && (
          <EditButton
            variant="contained"
            color="success"
            startIcon={<DoneIcon />}
            onClick={() => setEditorOpen(false)}
          >
            Done
          </EditButton>
        )}
        <div className="preview">
          <SpriteContainer>
            <SpriteCanvas
              ref={x1CanvasRef}
              width={`${sprite.sizeX}px`}
              height={`${sprite.sizeY}px`}
            ></SpriteCanvas>
            <h3 className="name">1x</h3>
          </SpriteContainer>
          <SpriteContainer>
            <SpriteCanvas
              ref={x2CanvasRef}
              width={`${sprite.sizeX}px`}
              height={`${sprite.sizeY}px`}
              className="x2"
            ></SpriteCanvas>
            <h3 className="name">2x</h3>
          </SpriteContainer>
          <SpriteContainer>
            <SpriteCanvas
              ref={x4CanvasRef}
              width={`${sprite.sizeX}px`}
              height={`${sprite.sizeY}px`}
              className="x4"
            ></SpriteCanvas>
            <h3 className="name">4x</h3>
          </SpriteContainer>
        </div>
      </SpritesContainer>
    </>
  );
}
