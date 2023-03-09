// material-ui
import { Box, useTheme } from '@mui/material';
import { Sidemenu } from '../backoffice/components/Sidemenu';
import React from 'react';
import backofficeConfig from '../backoffice/config';

const BackofficeLayout = ({ children }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Sidemenu />
      <Box
        component='main'
        sx={{
          maxWidth: `calc(100% - ${backofficeConfig.drawerWidth}px)`,
          flexGrow: 1,
          padding: theme.spacing(2),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default BackofficeLayout;
