import styled from '@emotion/styled';
import { Editor } from '@toast-ui/react-editor';
import { useRef } from 'react';

const ToastEditorBlock = styled.div`
  .toastui-editor-contents {
    font-size: 1.2rem;
    font-family: 'Pretendard';
  }
`;
const ToastEditor = ({ content, setPostForm, placeholder }) => {
  const editorRef = useRef();
  return (
    <ToastEditorBlock>
      <Editor
        initialValue={content}
        placeholder={placeholder}
        onChange={() => {
          setPostForm((s) => ({
            ...s,
            content: editorRef.current.getInstance().getHTML(),
          }));
        }}
        previewStyle='vertical'
        height='1000px'
        initialEditType='wysiwyg'
        useCommandShortcut={true}
        ref={editorRef}
      />
    </ToastEditorBlock>
  );
};

export default ToastEditor;
