import debug from 'debug';
import { store } from '../store';
import * as deviceActions from '../store/slices/device';
import * as editorActions from '../store/slices/editor';
import { addLog } from '../store/slices/terminal';
import * as compose from './comPayloads';
import { batch } from 'react-redux';
import { base64ToBytes } from '../utility/base64';
import { setSnapshotAvailable, setSnapshotLoading } from '../store/slices/layout';
import { setSpiffs, setSpiffsSize } from '../store/slices/spiffs';
import download from '../utility/fileDownload';
import { toast, Id } from 'react-toastify';

/* Components */
import CartridgeInfo from '../components/CartridgeInfo';

export default class Serial {
  private static _instance: Serial;
  private _log = debug('nanopy:serial');
  private _serialWorker: Worker | null = null;
  private _cartridgeToastId: null | Id = null;

  private constructor() {
    this._log('Serial class instantiated');
  }

  private _onOpen() {
    this._log('Connected');
    store.dispatch(deviceActions.setConnected());
    /* Fix for the Connect factory version, where the hw reset serial command is not working
       serialGetDeviceInfo is normally called after the ping is received */
    this.getDeviceInfos();
    setTimeout(() => {
      this.resetCard();
    }, 100);
  }

  private _onClose() {
    this._log('Connection closed');
    batch(() => {
      store.dispatch(deviceActions.setDisconnected());
      store.dispatch(editorActions.setShowDeviceState(false));
    });
  }

  private async _onMessage(data: string) {
    const message = JSON.parse(
      data.replaceAll('#', '"').replaceAll('$', '\n').replaceAll('~', '\\')
    );

    /* Handle server messages */
    switch (message.type) {
      case 'ping_response':
        this._log('Ping response received');
        break;

      case 'status':
        this._log('Status received:', message.content);
        if (message.content.head.error_id) {
          const errorMessage = message.content.head.error_text;
          const errorLine = message.content.head.source_line;
          const error: editorActions.EditorError = {
            message: errorMessage,
            line: errorLine,
            column: 0,
          };
          store.dispatch(editorActions.setError(error));
          store.dispatch(deviceActions.setStatus(message.content));
        } else {
          store.dispatch(deviceActions.setStatus(message.content));
          const cardState = message.content.head.run_mode;
          const line = message.content.head.source_line;

          switch (cardState) {
            case 'RUN':
              batch(() => {
                store.dispatch(editorActions.setMode(editorActions.mode.run));
                store.dispatch(editorActions.setBreakpoint(0));
                store.dispatch(editorActions.highlightLine(0));
              });
              break;
            case 'DEBUG_PLAY':
              batch(() => {
                store.dispatch(editorActions.setMode(editorActions.mode.debug_play));
                store.dispatch(editorActions.highlightLine(0));
              });
              break;
            case 'DEBUG_UNTIL':
              batch(() => {
                store.dispatch(editorActions.setMode(editorActions.mode.debug_until));
                store.dispatch(editorActions.highlightLine(0));
              });
              break;
            case 'DEBUG_OBSERVE':
              batch(() => {
                store.dispatch(editorActions.setMode(editorActions.mode.debug_observe));
                store.dispatch(editorActions.highlightLine(line));
              });
              break;
            case 'DEBUG_PAUSE':
              batch(() => {
                store.dispatch(editorActions.setMode(editorActions.mode.debug_pause));
                store.dispatch(editorActions.highlightLine(line));
              });
              break;
            default:
              break;
          }
        }
        break;

      case 'breakpoint_response':
        this._log('Breakpoint response received', message);
        if (message.content === true) {
          store.dispatch(editorActions.setBreakpoint(message.line));
        } else {
          store.dispatch(editorActions.setBreakpoint(0));
        }
        break;

      case 'print':
        this._log('Print received', message);
        store.dispatch(
          addLog({
            timestamp: Date.now(),
            message: message.content,
            time: message.timestamp,
          })
        );
        break;

      case 'snapshot_response': {
        this._log('Snapshot response received');
        /* Replace Base64Url symbols and decode the base64 encoded image string */
        const rawImgData = base64ToBytes(message.content);
        /* Set the snapshot if the size matches the 240*240 Pixel display */
        if (rawImgData.length === 115200) {
          localStorage.setItem('editor.snapshot', message.content);
          store.dispatch(setSnapshotAvailable(true));
        }
        break;
      }

      case 'dir':
        this._log('Dir received', message);
        store.dispatch(setSpiffs(message.content));
        this.getSpiffsSize();
        break;

      case 'file':
        this._log('File received', message.content);
        download(base64ToBytes(message.content), message.name.split('/').slice(-1));
        break;

      case 'get_spiffs_size_response':
        this._log('SPIFFS size received', message.total, message.used);
        store.dispatch(setSpiffsSize({ total: message.total, used: message.used }));
        break;

      case 'get_device_response':
        this._log('Device info received', message);
        store.dispatch(deviceActions.setDeviceInfos(message));
        break;

      case 'ping':
        this._log('Ping received');
        this.sendPong();
        this.getDeviceInfos();
        break;

      case 'get_time':
        this._log('Get time received');
        this.sendUtc();
        break;

      case 'cartridge_connected':
        this._log('Cartridge connected received', message.content);
        this._cartridgeToastId = toast.info(<CartridgeInfo cartridge={message.content} />, {
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: false,
          icon: false,
          className: 'cartridge_toast',
        });
        break;

      case 'cartridge_disconnected':
        this._log('Cartridge disconnected received');
        if (this._cartridgeToastId) {
          toast.dismiss(this._cartridgeToastId);
          this._cartridgeToastId = null;
        }
        break;

      default:
        console.warn('Unknown message received:', data);
        break;
    }
  }

  private _sendData(payload: object) {
    const state = store.getState();
    if (state.device.isConnected && this._serialWorker) {
      const data = JSON.stringify(payload) + '\n';
      this._log('Send data %O', data);
      this._serialWorker.postMessage({ type: 'send', data });
    }
  }

  public static getInstance(): Serial {
    if (!Serial._instance) {
      Serial._instance = new Serial();
    }

    return Serial._instance;
  }

  public async connect() {
    this._log('Connecting');

    /* forget all previous connected ports */
    const ports = await navigator.serial.getPorts();
    ports.forEach((p) => {
      p.forget();
    });

    /* Filter for the Oxocard */
    const filters = [
      { usbVendorId: 1027, usbProductId: 24597 },
      { usbVendorId: 6790, usbProductId: 21795 },
    ];
    try {
      /* Get a port and open a connection */
      await navigator.serial.requestPort({ filters });

      /* If a worker already exists, terminate it first */
      if (this._serialWorker) {
        this._serialWorker.terminate();
      }

      this._serialWorker = new Worker(new URL('./serialWorker.ts', import.meta.url));

      this._serialWorker.onmessage = (e) => {
        const message = e.data;
        switch (message.type) {
          case 'connected':
            this._onOpen();
            break;

          case 'disconnected':
            if (this._serialWorker) {
              this._serialWorker.terminate();
              this._serialWorker = null;
            }
            this._onClose();
            break;

          case 'dataReceived':
            this._onMessage(message.data);
            break;

          default:
            break;
        }
      };

      /* Tell the webworker to take over the communication */
      this._serialWorker.postMessage({ type: 'connect' });
    } catch (e) {
      console.error(e);
    }
  }

  public disconnect() {
    this._log('Disconnecting');
    if (this._serialWorker) {
      this._serialWorker.postMessage({ type: 'disconnect' });
    }
  }

  public sendCode(code: string) {
    this._sendData(compose.runCodePayload(code));
    store.dispatch(editorActions.highlightLine(0));
  }

  public sendCurrentCode() {
    const state = store.getState();
    this._sendData(compose.runCodePayload(state.editor.code.replaceAll('\r', '')));
    store.dispatch(editorActions.highlightLine(0));
  }

  public sendDebugCode() {
    const state = store.getState();
    this._sendData(compose.debugCodePayload(state.editor.code.replaceAll('\r', '')));
    store.dispatch(editorActions.highlightLine(0));
  }

  public debugRun() {
    this._sendData(compose.debugRunPayload());
  }

  public debugObserve() {
    const state = store.getState();
    this._sendData(compose.debugObservePayload(state.editor.observeSpeed));
  }

  public debugPause() {
    this._sendData(compose.debugPausePayload());
  }

  public debugStep() {
    this._sendData(compose.debugStepPayload());
  }

  public debugSetBreakpoint(line: number) {
    const state = store.getState();
    if (line === state.editor.breakpointLine) {
      this._sendData(compose.debugBreakpointPayload(-1));
    } else {
      this._sendData(compose.debugBreakpointPayload(line));
    }
  }

  public debugStepToBreakpoint() {
    this._sendData(compose.debugStepToBreakpointPayload());
  }

  public restartCard() {
    this._sendData(compose.restartCardPayload());
    batch(() => {
      /* Reset the editor state */
      store.dispatch(editorActions.setMode(editorActions.mode.idle));
      store.dispatch(editorActions.setBreakpoint(0));
      store.dispatch(editorActions.highlightLine(0));
    });
  }

  public resetCard() {
    this._sendData(compose.hwResetCardPayload());
    batch(() => {
      /* Reset the editor state */
      store.dispatch(editorActions.setMode(editorActions.mode.idle));
      store.dispatch(editorActions.setBreakpoint(0));
      store.dispatch(editorActions.highlightLine(0));
    });
  }

  public enablePrint() {
    this._sendData(compose.enablePrintPayload());
  }

  public disablePrint() {
    this._sendData(compose.disablePrintPayload());
  }

  public getSnapshot() {
    this._sendData(compose.snapshotPayload());
    store.dispatch(setSnapshotLoading());
  }

  public getDeviceInfos() {
    this._sendData(compose.getDeviceInfosPayload());
  }

  public sendPong() {
    this._sendData(compose.getPongPayload());
  }

  public sendUtc() {
    this._sendData(compose.getUtcResponsePayload());
  }

  public readSpiffsDirectory(path: string) {
    this._sendData(compose.readSpiffsDirectoryPayload(path));
  }

  public writeSpiffsFile(path: string, content: string) {
    this._sendData(compose.writeSpiffsFilePayload(path, content));
  }

  public writeBinarySpiffsFile(path: string, content: string) {
    this._sendData(compose.writeBinarySpiffsFilePayload(path, content));
  }

  public appendSpiffsFile(path: string, content: string) {
    this._sendData(compose.appendSpiffsFilePayload(path, content));
  }

  public appendBinarySpiffsFile(path: string, content: string) {
    this._sendData(compose.appendBinarySpiffsFilePayload(path, content));
  }

  public readSpiffsFile(path: string, offset?: number, size?: number) {
    this._sendData(compose.readSpiffsFilePayload(path, offset, size));
  }

  public deleteSpiffsFile(path: string) {
    this._sendData(compose.deleteSpiffsFilePayload(path));
  }

  public renameSpiffsFile(path: string, newPath: string) {
    this._sendData(compose.renameSpiffsFilePayload(path, newPath));
  }

  public getSpiffsSize() {
    this._sendData(compose.getSpiffsSizePayload());
  }
}
