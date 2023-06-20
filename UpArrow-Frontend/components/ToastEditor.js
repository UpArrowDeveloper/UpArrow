import styled from "@emotion/styled";
import { Editor } from "@toast-ui/react-editor";
import { useRef } from "react";
import { mobileWidth } from "../styles/responsive";
import { useMobile } from "../hooks/useMobile";

const ToastEditorBlock = styled.div`
  .toastui-editor-contents {
    font-size: 1.2rem;
    font-family: "Pretendard";
  }
`;

const ToastEditor = ({ content, setPostForm, placeholder }) => {
  const editorRef = useRef();
  const { isMobile } = useMobile();
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
        height={isMobile ? "400px" : "1000px"}
        previewStyle={
          window.innerWidth > +mobileWidth.split("px")[0] ? "vertical" : "tab"
        } // tab, vertical
        initialEditType="wysiwyg"
        hideModeSwitch={true}
        useCommandShortcut={true}
        ref={editorRef}
      />
    </ToastEditorBlock>
  );
};

export default ToastEditor;
