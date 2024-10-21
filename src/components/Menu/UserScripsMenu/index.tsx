import { ChangeEvent } from 'react';
import styled from 'styled-components';
import { batch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { showPopup } from '../../Popup';
import Serial from '../../../serial';

/* Components */
import UserScript from './UserScript';

/* Store */
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { Script, changeName, saveUserScripts, setCode } from '../../../store/slices/editor';

/* Images */
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddIcon from '../../../assets/svg/icon_add_document.svg?react';

/* Styles */
const UserCodesContainer = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  overflow: auto;

  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const TitleContainer = styled.div`
  margin-bottom: 1rem;

  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-size: 2.2rem;
    font-weight: 500;
  }
`;

const CodeList = styled.ul`
  list-style: none;
  margin: 0;
  margin-top: 1.5rem;
  padding: 0;
`;

const TitleButtons = styled.div`
  display: flex;
`;

const UploadButton = styled.span`
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  margin-right: 0.5rem;
  margin-left: 0.5rem;

  display: flex;
  align-items: center;

  svg {
    fill: ${({ theme }) => theme.colors.primary};
    width: 3rem;
  }

  &:hover {
    svg {
      fill: ${({ theme }) => theme.colors.highlightBlue};
    }
  }
`;

const AddButton = styled.button`
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  margin-right: 0.5rem;

  display: flex;
  align-items: center;

  svg {
    fill: ${({ theme }) => theme.palette.text.primary};
    width: 2rem;
  }

  &:hover {
    svg {
      fill: ${({ theme }) => theme.colors.highlightBlue};
    }
  }
`;

function UserScriptsMenu() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const currentScriptName = useAppSelector((state) => state.editor.fileName);
  const fileStructure = useAppSelector((state) => state.spiffs.fileStructure);

  let userScripts = useAppSelector((state) => state.editor.userScripts);

  if (userScripts.length > 1) {
    userScripts = [...userScripts].sort((a, b) => b.changedAt - a.changedAt);
  }

  const deviceScripts =
    fileStructure.folders?.find((f) => f.name === 'user_scripts')?.files?.map((f) => f.name) || [];

  /* Function to add numbers after the given name in care
     there is already a script with that name */
  const findNameNumber = (name: string): string => {
    console.log(userScripts);
    if (userScripts.find((script) => script.name === name)) {
      let cnt = 2;
      while (userScripts.find((script) => script.name === `${name} ${cnt}`)) {
        cnt++;
      }
      const fileName = `${name} ${cnt}`;
      return fileName;
    } else {
      return name;
    }
  };

  const loadUserCode = (id: string) => {
    const script = userScripts.find((script) => script.id === id);
    if (!script) return;
    dispatch(setCode(script));
  };

  const deleteUserCode = async (id: string, name: string) => {
    const res = await showPopup(t('menu_user_code_delete_text'), {
      title: t('menu_user_code_delete_title', { name }),
      acceptText: t('button_yes'),
      declineText: t('button_no'),
      closeOnBackdrop: true,
    });
    if (res) {
      /* If the current script is deleted, load the first one if its not the current one */
      if (name === currentScriptName) {
        if (userScripts[0].name !== name) {
          loadUserCode(userScripts[0].id);
        } else if (userScripts.length > 1) {
          loadUserCode(userScripts[1].id);
        } else {
          const newScript: Script = {
            id: crypto.randomUUID(),
            name: 'My new script',
            content: '',
            changedAt: Date.now(),
          };
          dispatch(setCode(newScript));
        }
      }

      const newUserScripts = userScripts.filter((script) => script.id !== id);
      dispatch(saveUserScripts(newUserScripts));

      const scriptName = name.includes('.npy') ? name : `${name}.npy`;

      /* Delete the script on the device too if it exists */
      if (deviceScripts.includes(scriptName)) {
        const serial = Serial.getInstance();
        serial.deleteSpiffsFile(`user_scripts/${scriptName}`);
        setTimeout(() => {
          serial.readSpiffsDirectory('');
        }, 1000);
      }
    }
  };

  const renameCode = (id: string, newName: string, oldName: string) => {
    if (oldName === newName) return oldName;
    const name = findNameNumber(newName);
    const newUserScripts = userScripts.map((script) => {
      if (script.id === id) {
        return { ...script, name };
      } else {
        return script;
      }
    });

    /* if the current selected scripts name is changed,
       update the editors code as well */
    if (oldName === currentScriptName) {
      batch(() => {
        dispatch(changeName(name));
        dispatch(saveUserScripts(newUserScripts));
      });
    } else {
      dispatch(saveUserScripts(newUserScripts));
    }

    return name;
  };

  const newUserCode = () => {
    const newScript: Script = {
      id: crypto.randomUUID(),
      name: findNameNumber('My new script'),
      content:
        'YmFja2dyb3VuZCgwLDAsMCkKbm9TdHJva2UoKQoKZGVmIG9uRHJhdygpOgoJZm9yIGkgaW4gMjA6CgkJZmlsbChyYW5kb20oMCwgMjQwKSwgcmFuZG9tKDAsIDI0MCksIHJhbmRvbSgwLDI0MCkpCgkJZHJhd1JlY3RhbmdsZSgxICsgcmFuZG9tKDAsIDEyKSAqIDIwLCAxICsgcmFuZG9tKDAsIDEyKSAqIDIwLCAxOCwgMTgpCgl1cGRhdGUoKQoJaWYgZ2V0QnV0dG9uKCk6CgkJaWYgcmV0dXJuVG9NZW51KCk6CgkJCXJldHVybgo=',
      changedAt: Date.now(),
    };
    const newUserScripts = [...userScripts, newScript];
    dispatch(saveUserScripts(newUserScripts));
  };

  const onUploadScript = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    /* Get the name of the file without the file extension */
    const fileName = file.name.replace(/.npy/gi, '').replace(/[^a-zA-Z0-9-_ ]/gi, '_');

    const reader = new FileReader();

    /* Set up a callback function to run when the file is loaded */
    reader.onload = function (event) {
      /* Get the code and add it as a new script */
      const code = event.target?.result;
      const newScript: Script = {
        id: crypto.randomUUID(),
        name: findNameNumber(fileName),
        content: window.btoa(code as string),
        changedAt: Date.now(),
      };
      const newUserScripts = [...userScripts, newScript];
      dispatch(saveUserScripts(newUserScripts));
    };

    /* Read the selected file as text*/
    reader.readAsText(file);

    e.target.value = '';
  };

  return (
    <UserCodesContainer>
      <TitleContainer>
        <h1>{t('menu_user_code_title')}:</h1>
        <TitleButtons>
          <label htmlFor="upload_script">
            <input
              style={{ display: 'none' }}
              id="upload_script"
              name="upload_script"
              type="file"
              accept=".npy"
              onChange={onUploadScript}
            />
            <UploadButton
              data-tooltip-id="main-tooltip"
              data-tooltip-content={t('menu_user_code_upload_script')}
            >
              <UploadFileIcon />
            </UploadButton>
          </label>
          <AddButton
            onClick={() => newUserCode()}
            data-tooltip-id="main-tooltip"
            data-tooltip-content={t('menu_user_code_add_text')}
          >
            <AddIcon />
          </AddButton>
        </TitleButtons>
      </TitleContainer>
      <CodeList id="user_code_list">
        {userScripts.map((script) => (
          <UserScript
            key={script.id}
            script={script}
            isSelected={script.name === currentScriptName}
            savedOnDevice={
              deviceScripts.includes(script.name) || deviceScripts.includes(`${script.name}.npy`)
            }
            onLoad={loadUserCode}
            onDelete={() => deleteUserCode(script.id, script.name)}
            onRename={renameCode}
          />
        ))}
      </CodeList>
    </UserCodesContainer>
  );
}

export default UserScriptsMenu;
