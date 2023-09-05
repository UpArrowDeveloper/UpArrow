import { Box, Grid, StyledEngineProvider, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';
import { RecoilRoot } from 'recoil';
import api from '../../../apis';
import { BoStocksMenu } from '../../../backoffice/components/Stocks/BoStocksMenu';
import BackofficeLayout from '../../../Layouts/Backoffice';

const Backoffice = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useQuery(['userById', id], api.user.getById(id));

  if (!data) return null;
  return (
    <RecoilRoot>
      <StyledEngineProvider injectFirst>
        <BackofficeLayout>
          <Typography variant='h1'>User Info</Typography>
          <Grid container>
            <Grid item xs={3}>
              <Typography variant='h4'>name</Typography>
              <div style={{ fontSize: 14 }}>{data.name}</div>
            </Grid>
            <Grid item xs={3}>
              <Typography variant='h4'>cash</Typography>
              <div style={{ fontSize: 14 }}>{data.cash}</div>
            </Grid>
            <Grid item xs={3}>
              <Typography variant='h4'>username</Typography>
              <div style={{ fontSize: 14 }}>{data.username}</div>
            </Grid>
            <Grid item xs={3}>
              <Typography variant='h4'>email</Typography>
              <div style={{ fontSize: 14 }}>{data.email}</div>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <Typography variant='h4'>totalInvestment</Typography>
              <div style={{ fontSize: 14 }}>{data.totalInvestment}</div>
            </Grid>
            <Grid item xs={4}>
              <Typography variant='h4'>totalProfits</Typography>
              <div style={{ fontSize: 14 }}>{data.totalProfits}</div>
            </Grid>
            <Grid item xs={4}>
              <Typography variant='h4'>totalAssets</Typography>
              <div style={{ fontSize: 14 }}>{data.totalAssets}</div>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <Typography variant='h4'>followers</Typography>
              <div style={{ fontSize: 14 }}>{data.followers.length}</div>
            </Grid>
            <Grid item xs={4}>
              <Typography variant='h4'>followings</Typography>
              <div style={{ fontSize: 14 }}>{data.followings.length}</div>
            </Grid>
            <Grid item xs={4}>
              <Typography variant='h4'>isAdmin</Typography>
              <div style={{ fontSize: 14 }}>
                {data.isAdmin ? 'true' : 'false'}
              </div>
            </Grid>
          </Grid>
        </BackofficeLayout>
      </StyledEngineProvider>
    </RecoilRoot>
  );
};

export default Backoffice;
