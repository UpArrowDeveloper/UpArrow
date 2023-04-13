import { Box, Drawer } from '@mui/material';
import React from 'react';
import { BackofficeNavbarContent } from './BackofficeNavbarContent';

export const BackofficeNavbar = () => {
  return (
    <Box component='nav' aria-label='mailbox folders'>
      <BackofficeNavbarContent />
    </Box>
  );
};
