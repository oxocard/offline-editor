import styled from 'styled-components';

/* Components */
import MonacoEditor from './MonacoEditor';

/* Store */
import { useAppSelector } from '../../store/hooks';

/* Styles */
const EditorContainer = styled.div`
  flex: 1 1;
  overflow: hidden;
  position: relative;

  #monaco-container {
    height: 100%;
  }

  div.lines-content {
    padding-left: 1rem;
  }

  .errorDecorator {
    border-bottom: 3px solid #e5006fb9;
    cursor: pointer;
    text-decoration: underline;
    font-weight: bold;
    font-style: oblique;
  }

  .errorDecoratorMargin {
    background-color: #e5006f;
    clip-path: polygon(30% 0px, 80% 0px, 100% 50%, 80% 100%, 30% 100%);
  }

  .lineDecorator {
    cursor: pointer;
    text-decoration: underline;
    font-weight: bold;
    font-style: oblique;
  }

  .lineDecorator.n0 {
    background: #831f81c5;
  }
  .lineDecorator.n1 {
    background: #831f825a;
  }
  .lineDecorator.n2 {
    background: #831f8246;
  }
  .lineDecorator.n3 {
    background: #831f8232;
  }
  .lineDecorator.n4 {
    background: #831f821e;
  }
  .lineDecorator.n5 {
    background: #831f820a;
  }

  .lineDecoratorMargin {
    background-color: #831f81;
    clip-path: polygon(30% 0px, 70% 0px, 100% 50%, 70% 100%, 30% 100%);
  }

  &.light {
    .lineDecorator.n0 {
      background: #e04cddaa;
    }
    .lineDecorator.n1 {
      background: #e04cdd5a;
    }
    .lineDecorator.n2 {
      background: #e04cdd46;
    }
    .lineDecorator.n3 {
      background: #e04cdd32;
    }
    .lineDecorator.n4 {
      background: #e04cdd1e;
    }
    .lineDecorator.n5 {
      background: #e04cdd0a;
    }
    .lineDecoratorMargin {
      background: #e04cdd;
    }

    .current-line.current-line-margin-both {
      background-color: #b0b0b0;
    }
  }

  .tutorialLineDecorator {
    background: #1f6c83b9;
  }

  .breakpointDecorator {
    background: #1482dc;
    width: 20px !important;
    border-radius: 25px;
    margin-left: 3px;
  }

  .glyph-margin ~ .margin-view-overlays > div:hover::before {
    content: '';
    display: inline-block;
    background-color: #1482dc3f;
    width: 20px !important;
    height: 20px !important;
    border-radius: 25px;
    margin-left: 3px;
    position: absolute;
  }

  .current-line.current-line-margin-both {
    background-color: #696969;
    clip-path: polygon(30% 0px, 88% 0px, 100% 50%, 88% 100%, 30% 100%);
  }

  .minimap {
    border-left: 1px solid #303030;
  }

  .visible.scrollbar.vertical .slider {
    background-color: #333333a2;
  }
`;

function Editor() {
  const usedTheme = useAppSelector((state) => state.layout.theme);

  return (
    <EditorContainer id="editor" className={usedTheme}>
      <MonacoEditor />
    </EditorContainer>
  );
}

export default Editor;
