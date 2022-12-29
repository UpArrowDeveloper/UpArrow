import styled from '@emotion/styled';
import React from 'react';

const AvatarBlock = styled.img`
  border-radius: 999rem;
  object-fit: cover;
`;
export default function Avatar({ src, className }) {
  return <AvatarBlock src={src} className={className} />;
}
