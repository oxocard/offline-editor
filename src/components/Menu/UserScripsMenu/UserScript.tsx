/// <reference types="vite-plugin-svgr/client" />
import { FormEvent, useContext, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { useTranslation } from 'react-i18next';
import Serial from '../../../serial';
import download from '../../../utility/fileDownload';
import loadOnCartridgeScript from './loadOnCartridge';

/* Components */

/* Store */
import { useAppSelector } from '../../../store/hooks';
import { Script } from '../../../store/slices/editor';

/* Images */
import BinIcon from '../../../assets/svg/icon_bin.svg?react';
import PenIcon from '../../../assets/svg/icon_pen.svg?react';
import TickIcon from '../../../assets/svg/icon_tick.svg?react';
import CancelIcon from '../../../assets/svg/icon_cancel.svg?react';
import DownloadIcon from '../../../assets/svg/icon_download.svg?react';
import RemoveScriptIcon from '../../../assets/svg/icon_remove_script.svg?react';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';

/* Interfaces */
export interface UserScriptProps {
  script: Script;
  isSelected: boolean;
  savedOnDevice: boolean;
  onLoad: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onRename: (id: string, newName: string, oldName: string) => string;
}

interface IconButtonProps {
  $hoverColor?: string;
}

/* Styles */
const CodeContainer = styled.li`
  font-size: 1.6rem;
  padding: 0.25rem 0px;
  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;

  #name_form {
    flex: 1;
  }

  .controls {
    display: none;
  }

  &:hover .controls {
    display: flex;
  }
`;

const Code = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  user-select: none;
  max-width: 80%;
  white-space: nowrap;
  overflow: hidden;

  &.selected {
    color: ${({ theme }) => theme.colors.highlightBlue};
  }

  &.saved {
    color: ${({ theme }) => theme.colors.highlightGreen};
  }
`;

const IconButton = styled.button<IconButtonProps>`
  height: 1.8rem;
  width: 1.8rem;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  margin-left: 1rem;

  display: flex;
  align-items: center;

  svg {
    fill: ${({ theme }) => theme.palette.text.primary};
    width: 100%;
    height: 100%;
  }

  &:hover svg {
    fill: ${({ theme, $hoverColor }) => ($hoverColor ? $hoverColor : theme.colors.highlightBlue)};
  }

  &:active {
    padding: 0.1rem;
  }
`;

const Space = styled.div`
  flex: 1;
`;

const ScriptName = styled.input`
  background-color: ${({ theme }) => theme.colors.mainHeaderBackground};
  color: ${({ theme }) => theme.colors.highlightGreen};
  border: none;
  font-size: 1.6rem;
  outline: none;
  padding: 0.5rem;
  margin: -0.5rem;
  width: 100%;
`;

function UserScript({
  script,
  isSelected,
  savedOnDevice,
  onLoad,
  onDelete,
  onRename,
}: UserScriptProps) {
  const { t } = useTranslation();

  const [isEditable, setEditable] = useState(false);
  const [name, setName] = useState(script.name);

  const isConnected = useAppSelector((state) => state.device.isConnected);
  const deviceInfo = useAppSelector((state) => state.device.deviceInfo);
  const isOxocardConnect = deviceInfo.supType === 'Connect';

  const theme = useContext(ThemeContext);

  const onLoadOnCartridge = () => {
    const scriptName = script.name.includes('.npy') ? script.name : `${script.name}.npy`;
    let startCode = window.atob(loadOnCartridgeScript.startScript);
    startCode = startCode.replace(loadOnCartridgeScript.pattern, scriptName);
    const serial = Serial.getInstance();
    serial.sendCode(startCode);
    setTimeout(() => {
      serial.writeSpiffsFile(`user_scripts/${scriptName}`, window.atob(script.content));
      setTimeout(
        () => {
          let code = window.atob(loadOnCartridgeScript.flashScript);
          code = code.replace(loadOnCartridgeScript.pattern, scriptName);
          serial.sendCode(code);
        },
        /* Estimation of the time it takes to download the script,
           depending on the scripts size */
        script.content.length / 7 + 1000
      );
    }, 2000);
  };

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setEditable(false);
    setName(onRename(script.id, name, script.name));
  };

  const handleCancel = () => {
    setEditable(false);
    setName(script.name);
  };

  const onLoadOnDevice = () => {
    const scriptName = script.name.includes('.npy') ? script.name : `${script.name}.npy`;
    const serial = Serial.getInstance();
    serial.writeSpiffsFile(`user_scripts/${scriptName}`, window.atob(script.content));
    setTimeout(() => {
      serial.readSpiffsDirectory('');
    }, 1000);
  };

  const onDeleteOnDevice = () => {
    const scriptName = script.name.includes('.npy') ? script.name : `${script.name}.npy`;
    const serial = Serial.getInstance();
    serial.deleteSpiffsFile(`user_scripts/${scriptName}`);
    setTimeout(() => {
      serial.readSpiffsDirectory('');
    }, 1000);
  };

  const onDownload = () => {
    download(atob(script.content), script.name + '.npy', 'text/plain');
  };

  return (
    <CodeContainer>
      {!isEditable && (
        <>
          <Code
            className={
              isSelected ? 'user_code selected' : savedOnDevice ? 'user_code saved' : 'user_code'
            }
            onClick={() => onLoad(script.id)}
          >
            {script.name}
          </Code>
          <Space />
          <div className="controls">
            {isConnected && isOxocardConnect && (
              <IconButton
                className="material_icon"
                onClick={onLoadOnCartridge}
                data-tooltip-id="main-tooltip"
                data-tooltip-content={t('menu_load_on_cartridge')}
              >
                <MoveToInboxIcon />
              </IconButton>
            )}

            {isConnected && (
              <IconButton
                onClick={onLoadOnDevice}
                $hoverColor={theme!.colors.highlightGreen}
                data-tooltip-id="main-tooltip"
                data-tooltip-content={t('menu_user_code_load_on_card')}
              >
                <DownloadIcon />
              </IconButton>
            )}
            {savedOnDevice && isConnected && (
              <IconButton
                onClick={onDeleteOnDevice}
                $hoverColor={theme!.colors.highlightRed}
                data-tooltip-id="main-tooltip"
                data-tooltip-content={t('menu_user_code_remove_from_card')}
              >
                <RemoveScriptIcon />
              </IconButton>
            )}
            <IconButton
              className="material_icon"
              onClick={onDownload}
              data-tooltip-id="main-tooltip"
              data-tooltip-content={t('menu_user_code_download')}
            >
              <BrowserUpdatedIcon />
            </IconButton>
            <IconButton
              onClick={() => setEditable(true)}
              data-tooltip-id="main-tooltip"
              data-tooltip-content={t('menu_user_code_rename')}
            >
              <PenIcon />
            </IconButton>
            <IconButton
              onClick={() => onDelete(script.id, script.name)}
              $hoverColor={theme!.colors.highlightRed}
              data-tooltip-id="main-tooltip"
              data-tooltip-content={t('menu_user_code_delete')}
            >
              <BinIcon />
            </IconButton>
          </div>
        </>
      )}
      {isEditable && (
        <>
          <form id="name_form" onSubmit={handleSubmit}>
            <ScriptName
              aria-label="Script name input"
              id="top_bar_input"
              type="text"
              value={name}
              onChange={(evt) => {
                setName(evt.target.value);
              }}
              autoComplete="off"
              autoFocus
            />
          </form>
          <IconButton onClick={() => handleCancel()} $hoverColor={theme!.colors.highlightRed}>
            <CancelIcon />
          </IconButton>
          <IconButton type="submit" form="name_form" $hoverColor={theme!.colors.highlightGreen}>
            <TickIcon />
          </IconButton>
        </>
      )}
    </CodeContainer>
  );
}

export default UserScript;
