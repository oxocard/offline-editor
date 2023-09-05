import { useRef, useLayoutEffect } from 'react';
import * as monaco from 'monaco-editor';
import { getMonarchTokensProvide, getMonarchCompletionItemProvider } from './nanopy_code_monarch';
import Serial from '../../serial';

/* Components */

/* Store */
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { changeCode, setScrollTop } from '../../store/slices/editor';

/* Register a new language */
monaco.languages.register({ id: 'nanopy' });

/* Register a tokens provider for the language */
monaco.languages.setMonarchTokensProvider('nanopy', getMonarchTokensProvide());
monaco.languages.registerCompletionItemProvider('nanopy', getMonarchCompletionItemProvider());

monaco.editor.defineTheme('light', {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'keyword.nanopy', foreground: '0059E3' },
    { token: 'function.nanopy', foreground: '00A600' },
    { token: 'customfunction.nanopy', foreground: 'E67300' },
    { token: 'constants.nanopy', foreground: '9d00b5' },
  ],
  colors: {
    'editorLineNumber.foreground': '#9f9f9f',
    'editor.lineHighlightBackground': '#e1e1e1',
  },
});

monaco.editor.defineTheme('dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: '', background: '191919' },
    { token: 'keyword.nanopy', foreground: '00a7e3' },
    { token: 'function.nanopy', foreground: '79b51c' },
    { token: 'customfunction.nanopy', foreground: 'e67300' },
    { token: 'constants.nanopy', foreground: 'c657d9' },
  ],
  colors: {
    'editor.background': '#191919',
    'editorGutter.background': '#191919',
    'editorLineNumber.foreground': '#C7C7C7',
    'editor.lineHighlightBackground': '#303030',
    'editor.inactiveSelectionBackground': '#0067ee50',
    'editor.selectionHighlightBackground': '#0067ee80',
  },
});

function MonacoEditor() {
  const dispatch = useAppDispatch();

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const saveTimeoutId = useRef<NodeJS.Timeout | null>(null);
  const decorations = useRef<string[]>([]);
  const breakpointRef = useRef(0);
  const breakpointDecRef = useRef<string[]>([]);
  const focusLine = useRef(0);

  const isMenuOpen = useAppSelector((state) => state.layout.isMenuOpen);
  const theme = useAppSelector((state) => state.layout.theme);
  const code = useAppSelector((state) => state.editor.code);
  const error = useAppSelector((state) => state.editor.error);
  const highlightedLines = useAppSelector((state) => state.editor.highlightedLines);
  const breakpointLine = useAppSelector((state) => state.editor.breakpointLine);
  const scrollTop = useAppSelector((state) => state.editor.scrollTop);

  /* Time in ms to pass without any input for the editor to save the script */
  const SAVE_DEBOUNCE_MS = 500;

  const updateDimensions = () => {
    if (editorRef.current) {
      editorRef.current.layout();
    }
  };

  /* Function to update the editor if the state changes */
  const updateBreakpoint = () => {
    const line = breakpointRef.current;
    if (line) {
      if (editorRef.current) {
        breakpointDecRef.current = editorRef.current.deltaDecorations(breakpointDecRef.current, [
          {
            range: new monaco.Range(line, 1, line, 1),
            options: {
              glyphMarginClassName: 'breakpointDecorator',
            },
          },
        ]);
      }
    } else {
      if (editorRef.current) {
        breakpointDecRef.current = editorRef.current.deltaDecorations(breakpointDecRef.current, []);
      }
    }
  };

  /* Initial Layout Effect only runs once and inits the editor */
  useLayoutEffect(() => {
    const onDidChange = () => {
      /* Debouncing change event handler */
      clearTimeout(saveTimeoutId.current ?? undefined);
      saveTimeoutId.current = setTimeout(() => {
        /* Get the code and replace the double quotes special version to prevent errors */
        const code = editorRef.current?.getValue().replaceAll('“', '"').replaceAll('“', '"');
        const serial = Serial.getInstance();
        serial.debugPause();
        if (!code) return;
        dispatch(changeCode(code));
      }, SAVE_DEBOUNCE_MS);

      const line = breakpointRef.current;
      if (editorRef.current && line > editorRef.current.getValue().split('\n').length) {
        const serial = Serial.getInstance();
        serial.debugSetBreakpoint(0);
        breakpointDecRef.current = editorRef.current.deltaDecorations(breakpointDecRef.current, []);
        updateBreakpoint();
      }
    };

    if (!editorRef.current && editorContainerRef.current) {
      editorRef.current = monaco.editor.create(editorContainerRef.current, {
        value: '',
        language: 'nanopy',
        theme: 'dark',
        glyphMargin: true,
        lineNumbersMinChars: 3,
        lineHeight: 22,
        minimap: { showSlider: 'always' },
      });

      /* Add our own commentLineAction and add it to the contextMenu */
      const commentLineAction = editorRef.current.getAction('editor.action.commentLine'); // get existing to replace its id
      if (commentLineAction) {
        const newCommentLineAction = {
          id: commentLineAction.id,
          label: commentLineAction.label,
          alias: commentLineAction.alias,
          contextMenuGroupId: '1_modification', // "navigation", "9_cutcopypaste", "operation"
          contextMenuOrder: 1,
          keybindings: [
            monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Digit7,
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash,
          ],
          run: (editor: monaco.editor.IStandaloneCodeEditor) => {
            const selection = editor.getSelection();
            if (!selection) return;
            const start = selection.startLineNumber;
            const end = selection.endLineNumber;
            const srcArray = editor.getValue().split('\n');
            /* check if we have to comment or to uncomment */
            let comment = false;
            for (let i = start - 1; i < end; i++) {
              if (srcArray[i][0] !== '#') {
                comment = true;
                break;
              }
            }
            /* comment/uncomment each line */
            for (let i = start - 1; i < end; i++) {
              if (comment) {
                srcArray[i] = '# ' + srcArray[i];
              } else {
                if (srcArray[i][1] === ' ') srcArray[i] = srcArray[i].substring(2);
                else srcArray[i] = srcArray[i].substring(1);
              }
            }
            const newSrc = srcArray.join('\n');
            /* editor.setValue(newSrc) but so that undo/redo is still working */
            const range = editor?.getModel()?.getFullModelRange() || new monaco.Range(1, 1, 1, 1);
            const op: monaco.editor.IIdentifiedSingleEditOperation = {
              range: range,
              text: newSrc,
              forceMoveMarkers: true,
            };
            editor.executeEdits(commentLineAction.id, [op]);
            editor.setSelection(selection);
          },
        };
        editorRef.current.addAction(newCommentLineAction);
      }

      const model = editorRef.current.getModel();
      if (!model) return;
      model.updateOptions({ tabSize: 4 });
      model.setEOL(monaco.editor.EndOfLineSequence.LF);
      editorRef.current.onDidChangeModelContent(onDidChange);

      editorRef.current.changeViewZones((changeAccessor) => {
        const domNode = document.createElement('div');
        changeAccessor.addZone({
          afterLineNumber: 0,
          heightInLines: 1,
          domNode: domNode,
        });
      });

      /* Mouse down event used to set breakpoints */
      editorRef.current.onMouseDown(function (e) {
        /* Set the breakpoint, if the mouse down event was on the glyph-margin (Type = 2) */
        if (e.target.type === 2) {
          const serial = Serial.getInstance();
          serial.debugSetBreakpoint(e.target.position.lineNumber);
        }
      });
    }

    window.addEventListener('resize', updateDimensions);

    updateDimensions();

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [dispatch]);

  /* The editor need to update the size if a menu or the banner changes */
  useLayoutEffect(() => {
    updateDimensions();
  }, [isMenuOpen]);

  /* switch the theme of the editor */
  useLayoutEffect(() => {
    editorRef.current?.updateOptions({ theme: theme });
  }, [theme]);

  /* Update the editors value if the code change */
  useLayoutEffect(() => {
    if (editorRef.current) {
      const value = editorRef.current.getValue();
      if (code !== value) {
        editorRef.current.setValue(code);
      }
    }
  }, [code]);

  /* Handle the line highlighting of the code */
  useLayoutEffect(() => {
    if (error) {
      if (editorRef.current) {
        editorRef.current.revealLineInCenter(error.line);
        decorations.current = editorRef.current.deltaDecorations(decorations.current, [
          {
            range: new monaco.Range(error.line, 1, error.line, 1),
            options: {
              isWholeLine: true,
              minimap: { color: '#e5006d', position: 1 },
              className: 'errorDecorator',
              hoverMessage: { value: error.message },
              linesDecorationsClassName: 'errorDecoratorMargin',
            },
          },
        ]);
      }
    } else if (highlightedLines.length > 0) {
      if (editorRef.current) {
        const highlightedLine = highlightedLines[0];
        /* Set the scroll of the editor to the highlighted line if
             its 15 or more lines different from the previous scroll */
        if (focusLine.current < highlightedLine - 15 || focusLine.current > highlightedLine + 15) {
          focusLine.current = highlightedLine;
          editorRef.current.revealLineInCenter(highlightedLine);
        }

        decorations.current = editorRef.current.deltaDecorations(
          decorations.current,
          highlightedLines.map((line, i) => ({
            range: new monaco.Range(line, 1, line, 1),
            options: {
              isWholeLine: true,
              minimap: {
                color: '#831f81',
                darkColor: '#831f81',
                position: 1,
              },
              className: `lineDecorator n${i}`,
              linesDecorationsClassName: i === 0 ? 'lineDecoratorMargin' : '',
            },
          }))
        );
      }
    } else {
      if (editorRef.current) {
        decorations.current = editorRef.current.deltaDecorations(decorations.current, []);
      }
    }
  }, [error, highlightedLines]);

  /* Handle the breakpoint state */
  useLayoutEffect(() => {
    breakpointRef.current = breakpointLine;
    updateBreakpoint();
  }, [breakpointLine]);

  /* Handle the scroll top state */
  useLayoutEffect(() => {
    if (scrollTop && editorRef.current) {
      focusLine.current = 0;
      editorRef.current.revealLineInCenter(0);
      dispatch(setScrollTop(false));
    }
  }, [dispatch, scrollTop]);

  return <div ref={editorContainerRef} id="monaco-container" />;
}

export default MonacoEditor;
