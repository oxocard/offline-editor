import { ChangeEvent, MouseEvent, memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { styled } from '@mui/material/styles';
import { showPopup } from '../Popup';
import { showInputPopup } from '../Popup/InputPopup';
import { useTranslation } from 'react-i18next';
import { bytesToBase64 } from '../../utility/base64';
import Serial from '../../serial';

/* Components */
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, Button, CardHeader, IconButton, LinearProgress, Tooltip } from '@mui/material';
import { toast } from 'react-toastify';

/* Images */
import CloseIcon from '@mui/icons-material/Close';
import ReplayIcon from '@mui/icons-material/Replay';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

/* Store */
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addFolder } from '../../store/slices/spiffs';
import { SpiffsFolder, SpiffsStructure } from '../../types/spiffs';
import { setShowFileBrowser } from '../../store/slices/layout';

/* Interfaces */
interface SelectedItem {
  type: 'folder' | 'file';
  name?: string;
  path: string;
}

/* Styles */
const Container = styled('div')`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0px;
  left: 0px;
  pointer-events: none;
  z-index: 77;
`;

const Backdrop = styled('div')`
  width: 100%;
  height: 100%;
  background-color: #0008;
  pointer-events: auto;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentWrapper = styled('div')`
  max-height: 80vh;
  min-height: 32rem;
  overflow-y: hidden;

  display: flex;

  .file_structure {
    padding: 0 1rem 1rem 1rem;
    flex: 4;
    overflow-y: auto;
  }

  .file_actions {
    padding: 0 1rem 1rem 1rem;
    flex: 3;
    border-left: 2px solid #404040;
    font-size: 1.4rem;

    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .space {
      height: 3rem;
    }
  }
`;

const Folder = styled('div')`
  width: fit-content;

  .files {
    margin-left: 1rem;
  }
  .folders {
    margin-left: 1rem;
    margin-top: 0.75rem;
  }
  .name {
    font-size: 1.8rem;
    color: #6b7294;
    margin-bottom: 0.5rem;
    user-select: none;
    cursor: pointer;

    display: flex;
    align-items: center;

    &:hover {
      color: #41e600;
    }

    &.selected {
      color: #07baef;
    }
  }

  margin-bottom: 1rem;
`;

const File = styled('p')`
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 1.4rem;
  user-select: none;
  cursor: pointer;

  display: flex;
  align-items: center;

  &:hover {
    color: #41e600;
  }

  &.selected {
    color: #07baef;
  }
`;

const FileBrowserModal = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const serial = Serial.getInstance();

  const cardRef = useRef<HTMLDivElement>(null);

  const [selectedItem, setSelectedItem] = useState<SelectedItem>({
    type: 'folder',
    name: '',
    path: '',
  });

  const fileStructure = useAppSelector((state) => state.spiffs.fileStructure);
  const totalSpace = useAppSelector((state) => state.spiffs.totalSpace);
  const usedSpace = useAppSelector((state) => state.spiffs.usedSpace);

  const spacePercentage = totalSpace > 0 ? Math.ceil((usedSpace / totalSpace) * 100) : 0;

  /* Get all SPIFFS from the card on the first render */
  useEffect(() => {
    reloadFileStructure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Focus the card */
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.focus();
    }
  }, [cardRef]);

  const onSelectFolder = (e: MouseEvent<HTMLHeadingElement>, path: string) => {
    e.stopPropagation();
    setSelectedItem({ type: 'folder', path });
  };

  const onSelectFile = (e: MouseEvent<HTMLDivElement>, name: string, path: string) => {
    e.stopPropagation();
    setSelectedItem({ type: 'file', name, path });
  };

  const reloadFileStructure = (delay = 0) => {
    if (delay === 0) {
      serial.readSpiffsDirectory('');
    } else {
      setTimeout(() => {
        serial.readSpiffsDirectory('');
      }, delay);
    }
  };

  const onRenameFile = async () => {
    const pathAndName =
      selectedItem.path.length > 0
        ? `${selectedItem.path}/${selectedItem.name}`
        : selectedItem.name ?? '';
    const res = await showInputPopup(pathAndName, {
      title: t('file_browser_rename_file'),
      acceptText: t('button_save'),
      declineText: t('button_cancel'),
      closeOnBackdrop: true,
    });
    if (res) {
      /* Check if the path and name of the file is not to long */
      if (res.length <= 39) {
        serial.renameSpiffsFile(pathAndName, res);
        setSelectedItem({ type: 'folder', path: '' });
        reloadFileStructure(1000);
      } else {
        toast.error(t('file_browser_path_too_long'));
      }
    }
  };

  const onDownloadFile = () => {
    if (selectedItem.name) {
      serial.readSpiffsFile(
        selectedItem.path.length > 0
          ? `${selectedItem.path}/${selectedItem.name}`
          : selectedItem.name
      );
    }
  };

  const onDeleteFile = async () => {
    const name = selectedItem.name;
    if (name) {
      const res = await showPopup(t('file_browser_delete_text'), {
        title: t('file_browser_delete_title', { name }),
        acceptText: t('button_yes'),
        declineText: t('button_no'),
        closeOnBackdrop: true,
      });
      if (res) {
        serial.deleteSpiffsFile(
          selectedItem.path.length > 0 ? `${selectedItem.path}/${name}` : name
        );
        reloadFileStructure(1000);
      }
    }
  };

  const handleFileImport = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    /* Check if the path and name of the file is not to long */
    if (selectedItem.path.length + file.name.length <= 39) {
      file.arrayBuffer().then((buffer) => {
        serial.writeBinarySpiffsFile(
          selectedItem.path.length > 0 ? `${selectedItem.path}/${file.name}` : file.name,
          bytesToBase64(new Uint8Array(buffer))
        );
        reloadFileStructure(1000);
      });
    } else {
      toast.error(t('file_browser_path_too_long'));
    }

    e.target.value = '';
  };

  const onCreateFolder = async () => {
    const res = await showInputPopup(t('file_browser_new_folder_text'), {
      title: t('file_browser_new_folder_title'),
      acceptText: t('button_save'),
      declineText: t('button_cancel'),
      closeOnBackdrop: true,
    });
    if (res) {
      /* Check if the path of the folder is not to long */
      if (selectedItem.path.length + res.length < 25) {
        dispatch(addFolder({ path: selectedItem.path, name: res }));
      } else {
        toast.error(t('file_browser_path_too_long'));
      }
    }
  };

  /* Function to render the file structure recursively from the SPIFFS */
  const renderFileStructure = (folder: SpiffsStructure) => {
    return (
      <Folder key={folder.path}>
        <h2
          className={
            selectedItem.type === 'folder' && folder.path === selectedItem.path
              ? 'name selected'
              : 'name'
          }
          onClick={(e) => onSelectFolder(e, folder.path)}
        >
          <FolderOpenOutlinedIcon />
          &nbsp;
          {Object.prototype.hasOwnProperty.call(folder, 'name')
            ? (folder as SpiffsFolder).name
            : 'root'}
        </h2>
        <div className="files">
          {folder.files.map((file) => (
            <File
              key={file.name}
              className={
                selectedItem.type === 'file' &&
                file.name === selectedItem.name &&
                file.path === selectedItem.path
                  ? 'selected'
                  : ''
              }
              onClick={(e: MouseEvent<HTMLParagraphElement>) =>
                onSelectFile(e, file.name, file.path)
              }
            >
              <InsertDriveFileOutlinedIcon />
              &nbsp;{file.name}
            </File>
          ))}
        </div>
        <div className="folders">{folder.folders.map((f) => renderFileStructure(f))}</div>
      </Folder>
    );
  };

  return (
    <Container>
      <Backdrop onClick={() => dispatch(setShowFileBrowser(false))}>
        <Card
          tabIndex={-1}
          ref={cardRef}
          sx={{ minWidth: '64rem' }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Esc' || e.key === 'Escape') {
              dispatch(setShowFileBrowser(false));
              e.stopPropagation();
            }
          }}
        >
          <CardHeader
            title={<h3>{t('file_browser_title')}</h3>}
            action={
              <>
                <Tooltip title="Reload">
                  <IconButton aria-label="reload" onClick={() => reloadFileStructure()}>
                    <ReplayIcon />
                  </IconButton>
                </Tooltip>
                <IconButton aria-label="close" onClick={() => dispatch(setShowFileBrowser(false))}>
                  <CloseIcon />
                </IconButton>
              </>
            }
          />
          <CardContent>
            <ContentWrapper>
              <div className="file_structure" onClick={(e) => onSelectFolder(e, '')}>
                {(fileStructure.folders?.length || fileStructure.files?.length) &&
                  renderFileStructure(fileStructure)}
              </div>
              <div className="file_actions">
                <h3>{t('file_browser_current_path')}</h3>
                <p>
                  {selectedItem.path}
                  <span style={{ margin: '0px 0.25rem' }}>/</span>
                  {selectedItem.name}
                </p>
                {selectedItem.type === 'file' && (
                  <>
                    <div className="space"></div>
                    <Button
                      color="inherit"
                      variant="text"
                      startIcon={<CreateOutlinedIcon />}
                      fullWidth={false}
                      onClick={onRenameFile}
                    >
                      {t('button_rename')}
                    </Button>
                    <Button
                      color="inherit"
                      variant="text"
                      startIcon={<DownloadOutlinedIcon />}
                      fullWidth={false}
                      onClick={onDownloadFile}
                    >
                      {t('button_download')}
                    </Button>
                    <Button
                      color="error"
                      variant="text"
                      startIcon={<DeleteOutlineOutlinedIcon />}
                      fullWidth={false}
                      onClick={onDeleteFile}
                    >
                      {t('button_delete')}
                    </Button>
                  </>
                )}
                <div className="space"></div>
                <label htmlFor="upload_file">
                  <input
                    style={{ display: 'none' }}
                    id="upload_file"
                    name="upload_file"
                    type="file"
                    // accept=".xlsx"
                    onChange={handleFileImport}
                  />
                  <Button
                    color="inherit"
                    variant="text"
                    startIcon={<UploadOutlinedIcon />}
                    fullWidth={false}
                    component="span"
                  >
                    {t('button_upload')}
                  </Button>
                </label>
                <Button
                  color="inherit"
                  variant="text"
                  startIcon={<CreateNewFolderOutlinedIcon />}
                  fullWidth={false}
                  onClick={onCreateFolder}
                >
                  {t('file_browser_new_folder')}
                </Button>
              </div>
            </ContentWrapper>
          </CardContent>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ marginRight: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Memory Usage
                </Typography>
              </Box>
              <Box sx={{ flex: '1', mr: 1 }}>
                <LinearProgress variant="determinate" color="inherit" value={spacePercentage} />
              </Box>
              <Box sx={{ minWidth: 100 }}>
                <Typography variant="body2" color="text.secondary">{`${spacePercentage}% ${t(
                  'file_browser_memory_of'
                )} 3.6 MB`}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Backdrop>
    </Container>
  );
};

/* Export a memorized version of the File Browser to prevent rerenders if no data changes */
export const FileBrowser = memo(function FileBrowser() {
  const showFileBrowser = useAppSelector((state) => state.layout.showFileBrowser);

  return <>{showFileBrowser && createPortal(<FileBrowserModal />, document.body)}</>;
});
