import { useState } from 'react';

// material-ui
import { Box, StyledEngineProvider, useTheme } from '@mui/material';
import { Sidemenu } from '../backoffice/components/Sidemenu';

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
import backofficeConfig from '../backoffice/config';
import { BoStocksMenu } from '../backoffice/components/Stocks/BoStocksMenu';
import { BoPostsMenu } from '../backoffice/components/Posts/BoPostsForm';
import { BoUsersMenu } from '../backoffice/components/BoUsersMenu';
import { menuState } from '../backoffice/store/index';

const BackofficeApp = () => {
  const [menu] = useRecoilState(menuState);
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
        {menu === backofficeConfig.menus[0] && <BoStocksMenu />}
        {menu === backofficeConfig.menus[1] && <BoPostsMenu />}
        {menu === backofficeConfig.menus[2] && <BoUsersMenu />}
      </Box>
    </Box>
  );
};

const Backoffice = () => {
  return (
    <RecoilRoot>
      <StyledEngineProvider injectFirst>
        <BackofficeApp />
      </StyledEngineProvider>
    </RecoilRoot>
  );
};

export default Backoffice;
