import { styled } from '@mui/material/styles';
import { useRef, useLayoutEffect, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../theme';
import { base64ToBytes } from '../../utility/base64';

/* Components */
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

/* Store */
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSnapshotAvailable } from '../../store/slices/layout';

/* Styles */
const SnapshotViewBackdrop = styled('div')`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: #0008;
  z-index: 99;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const SnapshotViewWrapper = styled('div')`
  width: 500px;
  height: 500px;
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.snapshotViewBackground};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled('h1')`
  margin-bottom: 2rem;
  font-size: 3.2rem;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const LoadingContainer = styled('div')`
  width: 240px;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActionButton = styled(Button)`
  width: 240px;
  margin-top: 1rem;
`;

export default function SnapshotView() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const snapshotLoading = useAppSelector((state) => state.layout.snapshotLoading);
  const snapshotAvailable = useAppSelector((state) => state.layout.snapshotAvailable);

  useLayoutEffect(() => {
    if (snapshotAvailable && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rawImgData = base64ToBytes(localStorage.getItem('editor.snapshot') || '');

      /* New Buffer for a rgba image of size 240*240 pixel */
      const image = new Uint8ClampedArray(240 * 240 * 4);
      /* Convert the rgb565 data to rgba */
      for (let index = 0; index < 240 * 240 * 4; index += 4) {
        image[index] = rawImgData[index / 2 + 1] & 0xf8;
        image[index + 1] =
          ((rawImgData[index / 2 + 1] & 0x07) << 5) + ((rawImgData[index / 2] & 0xe0) >> 3);
        image[index + 2] = (rawImgData[index / 2] & 0x1f) << 3;
        image[index + 3] = 0xff;
      }
      /* Create an image and draw it in the canvas */
      const img = new ImageData(image, 240, 240);
      ctx.putImageData(img, 0, 0);
    }
  }, [snapshotAvailable]);

  const handleDownload = () => {
    if (canvasRef.current === null) return;
    const canvasImage = canvasRef.current.toDataURL('image/png');

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(xhr.response);
      a.download = 'snapshot.png';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    xhr.open('GET', canvasImage);
    xhr.send();
  };

  const handleClose = () => {
    localStorage.setItem('editor.snapshot', '');
    dispatch(setSnapshotAvailable(false));
  };

  if (snapshotAvailable || snapshotLoading) {
    return (
      <SnapshotViewBackdrop onClick={handleClose}>
        <SnapshotViewWrapper onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
          <Title>{t('snapshot_view_title')}</Title>
          {snapshotAvailable && <canvas ref={canvasRef} width="240" height="240" />}
          {snapshotLoading && (
            <LoadingContainer>
              <CircularProgress />
            </LoadingContainer>
          )}
          <ActionButton color="success" variant="contained" onClick={handleDownload}>
            {t('button_download')}
          </ActionButton>
          <ActionButton color="error" variant="outlined" onClick={handleClose}>
            {t('button_close')}
          </ActionButton>
        </SnapshotViewWrapper>
      </SnapshotViewBackdrop>
    );
  } else {
    return null;
  }
}
