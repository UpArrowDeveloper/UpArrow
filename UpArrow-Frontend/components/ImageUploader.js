import styled from '@emotion/styled';
import { ImageIcon } from './icons';

const ImageUploaderBlock = styled.div`
  display: flex;
  align-items: center;
  & > label {
    cursor: pointer;
  }
  & > input {
    display: none;
  }
  & > img {
    width: 2rem;
    height: 2rem;
  }
`;

const ImageUploader = ({ id, file, setFile }) => {
  console.log('file : ', file);
  return (
    <ImageUploaderBlock>
      <label for={id}>
        <ImageIcon src={ImageIcon} />
      </label>
      <input
        id={id}
        type='file'
        accept='image/*'
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const url = URL.createObjectURL(file);
          setFile({ file, url });
        }}
      />
      {file && <img src={file.url} />}
    </ImageUploaderBlock>
  );
};

export default ImageUploader;
