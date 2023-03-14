import styled from '@emotion/styled';
import React from 'react';

const Img = styled.img`
  width: 8rem;
  height: 8rem;
`;
export default function FilePreview({ file }) {
  if (file.url) {
    return <Img src={file.url}></Img>;
  } else {
    return <Img src='temp'></Img>;
  }
}
