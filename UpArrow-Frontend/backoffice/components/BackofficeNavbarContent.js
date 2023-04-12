import { Box } from '@mui/material';
import React from 'react';
import backofficeConfig from '../config';
import { useRouter } from 'next/router';
import { HeadH6Bold } from '../../styles/typography';
import styled from '@emotion/styled';

export const BackofficeNavbarContent = () => {
  const router = useRouter();
  return (
    <Box
      sx={{
        display: 'flex',
        padding: '1rem 3.2rem',
        borderBottom: '1px solid rgba(0, 0, 0, 0.15);',
      }}
    >
      {backofficeConfig.menus.map((text, index) => (
        <Box
          key={text}
          disablePadding
          onClick={() => {
            router.push('/backoffice/' + text.toLocaleLowerCase());
          }}
        >
          <Text style={{ padding: '2rem 2.4rem', cursor: 'pointer' }}>
            {text}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

const Text = styled.div`
  ${HeadH6Bold}
`;
