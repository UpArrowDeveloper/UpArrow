import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';

const Img = styled.img`
  width: 10rem;
  height: 10rem;
`;

const EmptyImage = styled.div`
  width: 10rem;
  height: 10rem;
  background-color: silver;
`;

export default function FilePreview({ file, url, hasEmptyImage, ...props }) {
  const [imageUrl, setImageUrl] = useState(url);
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageUrl(reader.result);
      });
      reader.readAsDataURL(file);
    } else if (!url) {
      setImageUrl();
    }
  }, [file]);
  return (
    <>
      {imageUrl ? (
        <Img src={imageUrl} {...props}></Img>
      ) : hasEmptyImage ? (
        <Img className='empty-image' />
      ) : (
        <EmptyImage {...props} />
      )}
    </>
  );
}
