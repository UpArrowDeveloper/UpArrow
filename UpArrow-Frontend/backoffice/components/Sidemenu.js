import { Box, Drawer } from '@mui/material';
import React from 'react';
import backofficeConfig from '../config';
import { SidemenuContent } from './SidemenuContent';

export const Sidemenu = () => {
  return (
    <Box
      component='nav'
      sx={{ flexShrink: { md: 0 }, zIndex: 1300 }}
      aria-label='mailbox folders'
    >
      <Drawer
        variant='permanent'
        anchor='right'
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: backofficeConfig.drawerWidth,
            borderRight: `1px solid black`,
            backgroundImage: 'none',
            boxShadow: 'inherit',
          },
        }}
      >
        <SidemenuContent />
      </Drawer>
    </Box>
  );
};
