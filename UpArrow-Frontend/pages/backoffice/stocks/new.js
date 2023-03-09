// material-ui
import { StyledEngineProvider } from '@mui/material';

// sales report status

// ==============================|| DASHBOARD - DEFAULT ||============================== //

import React from 'react';
import { RecoilRoot } from 'recoil';
import { BoStocksMenu } from '../../../backoffice/components/Stocks/BoStocksMenu';
import BackofficeLayout from '../../../Layouts/Backoffice';

const BackofficeApp = () => {
  return <BoStocksMenu />;
};

const Backoffice = () => {
  return (
    <RecoilRoot>
      <StyledEngineProvider injectFirst>
        <BackofficeLayout>
          <BackofficeApp />
        </BackofficeLayout>
      </StyledEngineProvider>
    </RecoilRoot>
  );
};

export default Backoffice;
