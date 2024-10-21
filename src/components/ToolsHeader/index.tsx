import { useContext, useState, useEffect } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { batch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Serial from '../../serial';

/* Components */
import SvgButton from '../SvgButton';
import ObserverSlider from './ObserverSlider';
import CircularProgress from '@mui/material/CircularProgress';

/* Store */
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  mode as editorModes,
  resetError,
  setObserveSpeed,
  setShowDeviceState,
} from '../../store/slices/editor';

/* Styles */
const ToolsHeaderContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.toolsHeaderBackground};
  height: 6rem;
  min-height: 6rem;
  padding: 0px 1rem;

  display: flex;
  align-items: center;
`;

export default function ToolsHeader() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);

  const [runDebounce, setRunDebounce] = useState(false);

  const editorMode = useAppSelector((state) => state.editor.mode);
  const breakpointLine = useAppSelector((state) => state.editor.breakpointLine);
  const observeSpeed = useAppSelector((state) => state.editor.observeSpeed);
  const isConnected = useAppSelector((state) => state.device.isConnected);

  const serial = Serial.getInstance();

  /* Debounce the run and rundebug commands because the card can not handle
     multiple calls before the last one finished  */
  const startRunDebounce = () => {
    setRunDebounce(true);
    setTimeout(() => {
      setRunDebounce(false);
    }, 2000);
  };

  /* Cancel the debounce if the card is ready */
  useEffect(() => {
    if (editorMode >= editorModes.run) {
      if (runDebounce) {
        setRunDebounce(false);
      }
    }
  }, [editorMode, runDebounce]);

  return (
    <ToolsHeaderContainer id="tool_bar">
      <SvgButton
        id="btn_run_code"
        altText="Run code"
        active={editorMode === editorModes.run}
        discreet={editorMode === editorModes.debug}
        disabled={!isConnected || runDebounce}
        onClick={() => {
          startRunDebounce();
          batch(() => {
            dispatch(resetError());
            dispatch(setShowDeviceState(true));
          });
          serial.sendCode();
        }}
      >
        {runDebounce ? (
          <CircularProgress size={'2rem'} color="success" />
        ) : (
          <svg
            className="svg_icon"
            id="svg_run_code"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 60"
            data-tooltip-id="main-tooltip"
            data-tooltip-content={t('tools_header_btn_run')}
          >
            <path d="M33.32,27.73h4.23c1.1,0,1.41.68.69,1.52l-9,10.44c-1.08,1.26-1.95.94-1.95-.72V32.73H23.08c-1.1,0-1.41-.68-.69-1.52l9-10.44c1.08-1.26,2-.94,2,.72Zm-2-3.85-5.89,6.85h2.88a1,1,0,0,1,1,1v4.85l5.89-6.85H32.32a1,1,0,0,1-1-1Z" />
          </svg>
        )}
      </SvgButton>
      <SvgButton
        id="btn_debug_code"
        altText="Debug code"
        active={editorMode >= editorModes.debug}
        discreet={editorMode === editorModes.run}
        disabled={!isConnected || runDebounce}
        onClick={() => {
          startRunDebounce();
          batch(() => {
            dispatch(resetError());
            dispatch(setShowDeviceState(true));
          });
          serial.sendDebugCode();
        }}
      >
        {runDebounce ? (
          <CircularProgress size={'2rem'} color="success" />
        ) : (
          <svg
            className="svg_icon"
            id="svg_debug_code"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 60"
            data-tooltip-id="main-tooltip"
            data-tooltip-content={t('tools_header_btn_debug')}
          >
            <path d="M26,30.1c0.8,0.3,1.2,1.1,0.9,1.9c-0.2,0.6-0.8,1-1.4,1c-0.2,0-0.3,0-0.5,0c0,0.6,0.1,1.1,0.3,1.7c0.2-0.1,0.5-0.2,0.7-0.2	c0.8,0,1.5,0.7,1.5,1.5c0,0.4-0.2,0.8-0.4,1c0.6,0.4,1.2,0.7,1.9,0.8v-3.2c-1-0.6-1.3-1.8-0.7-2.7c0.2-0.3,0.4-0.6,0.7-0.7v-1.8	c-0.6-0.1-1.2-0.3-1.7-0.5h-0.1C26.7,29.2,26.3,29.6,26,30.1z M32,27c0-1.1-0.9-2-2-2c-1.1,0-2,0.9-2,2c0,0,0,0,0,0.1h0.1	C29.3,27.6,30.7,27.6,32,27L32,27C32,27,32,27,32,27z M32.8,28.9c-0.6,0.3-1.2,0.4-1.8,0.5v1.8c1,0.6,1.3,1.8,0.7,2.7	c-0.2,0.3-0.4,0.6-0.7,0.7v3.2c0.7-0.1,1.4-0.4,1.9-0.8c-0.3-0.3-0.4-0.7-0.4-1.1c0-0.8,0.7-1.5,1.5-1.5c0.2,0,0.5,0.1,0.7,0.2 c0.2-0.5,0.3-1.1,0.3-1.7c-0.2,0-0.3,0-0.5,0c-0.8,0-1.5-0.7-1.5-1.5c0-0.7,0.4-1.2,1-1.4C33.7,29.6,33.3,29.2,32.8,28.9L32.8,28.9z M31.1,22c0.8-1.3,2.3-2.1,3.9-2c0.6,0,1,0.4,1,1s-0.4,1-1,1c-0.9-0.1-1.7,0.3-2.2,1c-0.1,0.2-0.2,0.5-0.3,0.7c0,0,0,0.1,0,0.1 c1,0.8,1.5,2.1,1.5,3.4c0.3,0.2,0.5,0.4,0.8,0.6l1.2-1.3c0.4-0.4,1.1-0.3,1.4,0.1c0.3,0.4,0.3,0.9,0,1.3L36,29.4	c0.5,0.8,0.8,1.7,0.9,2.6H39c0.6,0,1,0.4,1,1s-0.4,1-1,1h-2.1c-0.1,0.9-0.4,1.8-0.9,2.6l1.4,1.4c0.4,0.4,0.4,1,0,1.4 c-0.4,0.4-1,0.4-1.4,0l-1.3-1.3c-2.7,2.5-6.8,2.5-9.5,0L24,39.4c-0.4,0.4-1,0.4-1.4,0c-0.4-0.4-0.4-1,0-1.4l1.4-1.4 c-0.5-0.8-0.8-1.7-0.9-2.6H21c-0.6,0-1-0.4-1-1s0.4-1,1-1h2.1c0.1-0.9,0.4-1.8,0.9-2.6L22.6,28c-0.4-0.4-0.3-1.1,0.1-1.4	c0.4-0.3,0.9-0.3,1.3,0l1.3,1.3c0.2-0.2,0.5-0.4,0.8-0.6c-0.1-1.3,0.5-2.6,1.5-3.4c0,0,0-0.1,0-0.1c-0.2-1.2-1.3-1.9-2.4-1.7 c0,0-0.1,0-0.1,0c-0.6,0-1-0.4-1-1s0.4-1,1-1c1.6-0.1,3.1,0.6,3.9,2c0.2,0.3,0.3,0.7,0.4,1c0.2,0,0.4,0,0.6,0c0.2,0,0.4,0,0.7,0 C30.8,22.6,30.9,22.3,31.1,22z" />
          </svg>
        )}
      </SvgButton>
      <SvgButton
        id="btn_debug_run"
        altText="Debug run"
        disabled={editorMode <= editorModes.run}
        onClick={() => {
          serial.debugRun();
        }}
        activeColor={theme!.colors.toolsHeaderButtonActivePlay}
        active={editorMode === editorModes.debug_play}
      >
        <svg
          className="svg_icon"
          id="svg_debug_run"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 60 60"
          data-tooltip-id="main-tooltip"
          data-tooltip-content={
            editorMode <= editorModes.run ? '' : t('tools_header_btn_debug_run')
          }
        >
          <path d="M27,36h1l4.79-6L28,24H27ZM25,24a2,2,0,0,1,2-2h1a2.34,2.34,0,0,1,1.62.78l5.11,6.44a1.31,1.31,0,0,1,0,1.56l-5.11,6.44A2.32,2.32,0,0,1,28,38H27a2,2,0,0,1-2-2Z" />
        </svg>
      </SvgButton>
      <SvgButton
        id="btn_debug_observe"
        altText="Debug observe"
        disabled={editorMode <= editorModes.run}
        onClick={() => {
          serial.debugObserve();
        }}
        activeColor={theme!.colors.toolsHeaderButtonActivePlay}
        active={editorMode === editorModes.debug_observe}
      >
        <svg
          className="svg_icon"
          id="svg_debug_observe"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 60 60"
          data-tooltip-id="main-tooltip"
          data-tooltip-content={
            editorMode <= editorModes.run ? '' : t('tools_header_btn_debug_observe')
          }
        >
          <path d="M34,31l4.1,3h.8V26h-.8L34,29ZM23,33a.94.94,0,0,1,1-1h5a1,1,0,0,1,0,2H24A.94.94,0,0,1,23,33Zm-2-9V36H32V24Zm13,2.5,3.1-2.3a1.4,1.4,0,0,1,.9-.3h2a.94.94,0,0,1,1,1v10a.94.94,0,0,1-1,1H38a1.4,1.4,0,0,1-.9-.3L34,33.5V36a2,2,0,0,1-2,2H21a2,2,0,0,1-2-2V24a2,2,0,0,1,2-2H32a2,2,0,0,1,2,2Z" />
        </svg>
      </SvgButton>
      {editorMode > editorModes.run && (
        <ObserverSlider
          open={editorMode === editorModes.debug_observe}
          anchorEl={document.getElementById('btn_debug_snapshot')}
          onChange={(speed: number) => {
            dispatch(setObserveSpeed(speed));
            serial.debugObserve();
          }}
          defaultValue={observeSpeed}
        />
      )}
      <SvgButton
        id="btn_debug_pause"
        altText="Debug pause"
        activeColor={theme!.colors.toolsHeaderButtonActivePause}
        active={editorMode === editorModes.debug_pause}
        disabled={editorMode <= editorModes.run}
        onClick={() => {
          serial.debugPause();
        }}
      >
        <svg
          className="svg_icon"
          id="svg_debug_pause"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 60 60"
          data-tooltip-id="main-tooltip"
          data-tooltip-content={
            editorMode <= editorModes.run ? '' : t('tools_header_btn_debug_pause')
          }
        >
          <path d="M28,38H24a1,1,0,0,1-1-1V23a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1V37A1,1,0,0,1,28,38Zm-3-2h2V24H25Z" />
          <path d="M36,38H32a1,1,0,0,1-1-1V23a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1V37A1,1,0,0,1,36,38Zm-3-2h2V24H33Z" />
        </svg>
      </SvgButton>
      <SvgButton
        id="btn_debug_step"
        altText="Debug step"
        disabled={editorMode <= editorModes.run}
        onClick={() => {
          serial.debugStep();
        }}
      >
        <svg
          className="svg_icon"
          id="svg_debug_step"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 60 60"
          data-tooltip-id="main-tooltip"
          data-tooltip-content={
            editorMode <= editorModes.run ? '' : t('tools_header_btn_debug_step')
          }
        >
          <path d="M25,36h1l4.79-6L26,24H25ZM23,24a2,2,0,0,1,2-2h1a2.34,2.34,0,0,1,1.62.78l5.11,6.44a1.31,1.31,0,0,1,0,1.56l-5.11,6.44A2.32,2.32,0,0,1,26,38H25a2,2,0,0,1-2-2Z" />
          <path d="M35,23a1,1,0,0,1,2,0V37a1,1,0,0,1-2,0Z" />
        </svg>
      </SvgButton>
      <SvgButton
        id="btn_debug_run_breakpoint"
        altText="Debug run breakpoint"
        onClick={() => {
          serial.debugStepToBreakpoint();
        }}
        activeColor={theme!.colors.toolsHeaderButtonActiveBreakpoint}
        active={editorMode === editorModes.debug_until}
        disabled={!breakpointLine || editorMode <= editorModes.run}
      >
        <svg
          className="svg_icon"
          id="svg_debug_run_breakpoint"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 60 60"
          data-tooltip-id="main-tooltip"
          data-tooltip-content={
            !breakpointLine || editorMode <= editorModes.run
              ? ''
              : t('tools_header_btn_debug_run_breakpoint')
          }
        >
          <path d="M38.46,32.7c.55,0,.75.35.44.81l-2.72,4.08c-.61.91-1.11.76-1.08-.33V34.7H33.69c-.55,0-.75-.37-.44-.83L36,29.79c.61-.91,1.11-.75,1.11.34V32.7Z" />
          <path d="M23,36h1l4.79-6L24,24H23ZM21,24a2,2,0,0,1,2-2h1a2.34,2.34,0,0,1,1.62.78l5.11,6.44a1.31,1.31,0,0,1,0,1.56l-5.11,6.44A2.32,2.32,0,0,1,24,38H23a2,2,0,0,1-2-2Z" />
        </svg>
      </SvgButton>
      <SvgButton
        id="btn_debug_snapshot"
        altText="Snapshot"
        onClick={() => {
          serial.getSnapshot();
        }}
        disabled={editorMode <= editorModes.run}
      >
        <svg
          className="svg_icon"
          id="svg_debug_snapshot"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 60 60"
          data-tooltip-id="main-tooltip"
          data-tooltip-content={
            editorMode <= editorModes.run ? '' : t('tools_header_btn_debug_snapshot')
          }
        >
          <path d="M25,31c0-2.76,2.24-5,5-5s5,2.24,5,5-2.24,5-5,5-5-2.24-5-5Zm-4-5.5v12s18,0,18,0v-12s-3.65,0-3.65,0c-.28,0-.58-.21-.69-.46l-1.02-2.54h-7.29s-1.01,2.53-1.01,2.53c-.1,.26-.41,.47-.69,.47h-3.65Zm2.8-2l.83-2.07c.21-.51,.82-.93,1.37-.93h8.01c.55,0,1.16,.42,1.37,.93l.83,2.07h2.8c1.11,0,2,.89,2,2v12c0,1.11-.9,2-2,2H21c-1.11,0-2-.89-2-2v-12c0-1.11,.9-2,2-2h2.8Zm6.2,4.5c-1.66,0-3,1.34-3,3s1.34,3,3,3,3-1.34,3-3c0-.31-.05-.6-.13-.88-.24,.52-.76,.88-1.37,.88-.83,0-1.5-.67-1.5-1.5,0-.61,.36-1.13,.88-1.37-.28-.09-.58-.13-.88-.13Z" />
        </svg>
      </SvgButton>
    </ToolsHeaderContainer>
  );
}
