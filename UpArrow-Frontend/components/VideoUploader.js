import styled from "@emotion/styled";
import color from "../styles/color";
import { useState } from "react";
import { VideoIcon } from "./icons";
import { mobileWidth } from "../styles/responsive";

const VideoUploaderBlock = styled.div`
  & > input {
    width: 80%;
    position: absolute;
    z-index: 20;
    border: 0.1rem solid ${color.B80};
    padding: 0.72rem 1.2rem 0.72rem 2rem;
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
  }

  @media screen and (max-width: ${mobileWidth}) {
    & > input {
      width: calc(100% - 2rem);
      top: -3rem;
      left: 1rem;
    }
  }
`;

const VideoUploader = ({
  url,
  setUrl,
  placeholder = "ex. https://youtu.be/dKz095P7LdU",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <VideoUploaderBlock>
      <VideoIcon onClick={() => setIsOpen(true)} />
      {isOpen && (
        <input
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
    </VideoUploaderBlock>
  );
};

export default VideoUploader;
