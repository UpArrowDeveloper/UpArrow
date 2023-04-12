// material-ui
import { Box, StyledEngineProvider, useTheme } from '@mui/material';

// sales report status

// ==============================|| DASHBOARD - DEFAULT ||============================== //

import React from 'react';
import BackofficeLayout from '../../Layouts/Backoffice';

const BackofficeApp = () => {
  return <div>main</div>;
};

const Backoffice = () => {
  return (
    <StyledEngineProvider injectFirst>
      <BackofficeLayout>
        <BackofficeApp />
      </BackofficeLayout>
    </StyledEngineProvider>
  );
};

export default Backoffice;
