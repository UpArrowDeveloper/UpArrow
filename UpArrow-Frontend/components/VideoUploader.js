import styled from '@emotion/styled';
import color from '../styles/color';

const VideoUploaderBlock = styled.div`
  & > input {
    width: 100%;
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
  margin-bottom: 1.6rem;
`;

const VideoUploader = ({
  url,
  setUrl,
  placeholder = 'ex. https://youtu.be/dKz095P7LdU',
}) => {
  return (
    <VideoUploaderBlock>
      <input
        value={url}
        placeholder={placeholder}
        onChange={(e) => {
          setUrl(e.target.value);
        }}
      />
    </VideoUploaderBlock>
  );
};

export default VideoUploader;
