import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';

const Img = styled.img`
  width: 8rem;
  height: 8rem;
`;

const EmptyImage = styled.div`
  width: 8rem;
  height: 8rem;
  background-color: silver;
`;
export default function FilePreview({ file, url }) {
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
  return <>{imageUrl ? <Img src={imageUrl}></Img> : <EmptyImage />}</>;
}
