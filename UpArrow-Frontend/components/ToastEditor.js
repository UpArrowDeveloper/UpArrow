import styled from "@emotion/styled";
import { Editor } from "@toast-ui/react-editor";
import { useEffect, useRef, useState } from "react";
import { mobileWidth } from "../styles/responsive";
import { useMobile } from "../hooks/useMobile";
import VideoUploader from "./VideoUploader";
import color from "../styles/color";

const ToastEditorBlock = styled.div`
  .toastui-editor-contents {
    font-size: 1.2rem;
    font-family: "Pretendard";
  }

  .video-input {
    width: 80%;
    position: fixed;
    z-index: 40;
    border: 0.1rem solid ${color.B80};
    padding: 0.72rem 1.2rem 0.72rem 2rem;
    top: 50%;
    border-radius: 999rem;
    &:focus {
      outline: none;
    }
    &::placeholder {
      color: ${color.B80};
    }
  }

  .video-icon-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 30;
  }

  @media screen and (max-width: ${mobileWidth}) {
    .video-input {
      position: fixed;
      width: calc(100% - 2rem);

      left: 1rem;
    }
  }
`;

const ToastEditor = ({
  content,
  setPostForm,
  placeholder,
  setFile,
  url,
  setUrl,
}) => {
  const editorRef = useRef();
  const inputImageRef = useRef();
  const { isMobile } = useMobile();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    editorRef.current?.getInstance()?.insertToolbarItem(
      { groupIndex: 0, itemIndex: 1 },
      {
        name: "myItem",
        tooltip: "video",
        command: "bold",
        text: "",
        className: "toastui-editor-toolbar-icons video",
        style: {
          backgroundImage: `url(/images/Video.svg)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        },
      }
    );

    editorRef.current
      .getRootElement()
      .querySelector(".video")
      .addEventListener("click", (e) => {
        setIsOpen(true);
      });
  }, []);

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
        toolbarItems={[
          ["image"],
          ["heading", "bold", "italic", "strike"],
          ["hr", "quote"],
          ["ul", "ol", "task", "indent", "outdent"],
          ["table", , "link"],
          ["code", "codeblock"],
          // Using Option: Customize the last button
        ]}
      />
      <input
        ref={inputImageRef}
        className="image-input"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const url = URL.createObjectURL(f);
          setFile({ file: f, url });
        }}
      ></input>
      {isOpen && (
        <input
          className="video-input"
          value={url}
          placeholder={placeholder}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
        />
      )}
      {isOpen && (
        <div
          className="video-icon-wrapper"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </ToastEditorBlock>
  );
};

export default ToastEditor;
