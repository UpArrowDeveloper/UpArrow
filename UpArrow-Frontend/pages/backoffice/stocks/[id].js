import { StyledEngineProvider } from '@mui/material';
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
  const { data } = useQuery(['boStock', id], api.stock.getId(id));
  const { data: analysis } = useQuery(
    ['analysis', data?.analysisId],
    data?.analysisId ? api.analysis.getById(data?.analysisId) : () => {},
    { enabled: !!data?.analysisId }
  );
  if (!data || !analysis) return null;
  return (
    <RecoilRoot>
      <StyledEngineProvider injectFirst>
        <BackofficeLayout>
          <BoStocksMenu stock={data} analysis={analysis} />
        </BackofficeLayout>
      </StyledEngineProvider>
    </RecoilRoot>
  );
};

export default Backoffice;
