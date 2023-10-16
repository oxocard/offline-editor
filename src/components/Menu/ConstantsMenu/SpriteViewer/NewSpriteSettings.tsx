import { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

/* Components */
import { FormControl, InputLabel, MenuItem, TextField } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

/* Interfaces */
interface NewSpriteSettingProps {
  setSpriteName: (name: string) => void;
  setSpriteWidth: (width: number) => void;
  setSpriteHeight: (height: number) => void;
}

/* Styles */
const NameField = styled(TextField)`
  margin-top: 2rem;
  width: 30rem;
`;

const SizeSelect = styled(FormControl)`
  width: 7rem;
  margin-top: 2rem;
  margin-left: 1rem;
`;

const Note = styled.p`
  margin-top: 2rem;
  font-size: 1.3rem;
  color: gray;
`;

const spriteSizes = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22, 23, 24,
];

export default function NewSpriteSettings({
  setSpriteName,
  setSpriteWidth,
  setSpriteHeight,
}: NewSpriteSettingProps) {
  const { t } = useTranslation();

  const [name, setName] = useState('newSprite');
  const [width, setWidth] = useState(16);
  const [height, setHeight] = useState(16);

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setSpriteName(e.target.value);
    setName(e.target.value);
  };

  const onChangeWidth = (e: SelectChangeEvent<number>) => {
    const width = e.target.value as number;
    setSpriteWidth(width);
    setWidth(width);
  };

  const onChangeHeight = (e: SelectChangeEvent<number>) => {
    const height = e.target.value as number;
    setSpriteHeight(height);
    setHeight(height);
  };

  return (
    <>
      <NameField label={t('common_name')} variant="standard" value={name} onChange={onChangeName} />
      <SizeSelect variant="standard">
        <InputLabel id="width_select-label">{t('common_width')}</InputLabel>
        <Select
          labelId="width_select-label"
          id="width_select"
          value={width}
          label={t('common_width')}
          onChange={onChangeWidth}
        >
          {spriteSizes.map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </SizeSelect>
      <SizeSelect variant="standard">
        <InputLabel id="height_select-label">{t('common_height')}</InputLabel>
        <Select
          labelId="height_select-label"
          id="height_select"
          value={height}
          label={t('common_height')}
          onChange={onChangeHeight}
        >
          {spriteSizes.map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </SizeSelect>
      <Note>
        {t('menu_constants_new_sprite_popup_note')}
        <br />
        {t('menu_constants_new_sprite_popup_note_text')}
      </Note>
    </>
  );
}
