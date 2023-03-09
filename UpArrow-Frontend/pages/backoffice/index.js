// material-ui
import { Box, StyledEngineProvider, useTheme } from '@mui/material';
import { Sidemenu } from '../../backoffice/components/Sidemenu';

// sales report status

// ==============================|| DASHBOARD - DEFAULT ||============================== //

import React from 'react';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import backofficeConfig from '../../backoffice/config';
import { BoStocksMenu } from '../../backoffice/components/Stocks/BoStocksMenu';
import { BoPostsMenu } from '../../backoffice/components/Posts/BoPostsForm';
import { BoUsersMenu } from '../../backoffice/components/BoUsersMenu';
import { menuState } from '../../backoffice/store/index';
import BackofficeLayout from '../../Layouts/Backoffice';

const BackofficeApp = () => {
  return <div>main</div>;
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
