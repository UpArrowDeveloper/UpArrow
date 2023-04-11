import React from 'react';
import FilePreview from './FilePreview';

export const ProfileImageUploader = ({
  file,
  url,
  name,
  setImage,
  onChange,
}) => {
  return (
    <>
      <label htmlFor={name}>
        <FilePreview hasEmptyImage={true} file={file} url={url} />
      </label>
      <input
        type='file'
        id={name}
        name={name}
        hidden
        onChange={(e) => {
          setImage?.(e.target.files[0]);
          onChange?.(e);
        }}
      />
    </>
  );
};
