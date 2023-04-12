// material-ui
import { Box, useTheme } from '@mui/material';
import { BackofficeNavbar } from '../backoffice/components/BackofficeNavbar';
import React from 'react';
import backofficeConfig from '../backoffice/config';

const BackofficeLayout = ({ children }) => {
  const theme = useTheme();
  return (
    <Box>
      <BackofficeNavbar />
      <Box
        component='main'
        sx={{
          padding: '5.6rem',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default BackofficeLayout;
