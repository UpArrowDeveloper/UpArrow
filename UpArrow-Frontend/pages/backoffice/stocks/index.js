// material-ui
import {
  Box,
  Button,
  StyledEngineProvider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import Paper from '@mui/material/Paper';
import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';

import React, { useState } from 'react';
import { RecoilRoot } from 'recoil';
import api from '../../../apis';
import BackofficeLayout from '../../../Layouts/Backoffice';
import { useRouter } from 'next/router';

const columns = [
  {
    field: 'logoUrl',
    headerName: 'Logo',
    width: 50,
    type: 'image',
    renderCell: (params) => {
      return <Image src={params.value} width={30} height={30} />;
    },
  },
  { field: 'name', headerName: 'Name', width: 130 },
  { field: 'ticker', headerName: 'Ticker', width: 130 },
  {
    field: 'currentPrice',
    headerName: 'currentPrice',
    type: 'number',
    width: 90,
  },
  {
    field: 'targetPrice',
    headerName: 'targetPrice',
    type: 'number',
    width: 90,
  },
  {
    field: 'createdAt',
    headerName: 'createdAt',
    type: 'date',
    width: 90,
    valueGetter: (params) => new Date(params.value),
  },
  {
    field: 'updatedAt',
    headerName: 'updatedAt',
    type: 'date',
    width: 90,
    valueGetter: (params) => new Date(params.value),
  },
];

const BackofficeStockList = () => {
  const { data } = useQuery(['stock list'], api.stock.get);
  const [selectedIds, setSelectedIds] = useState([]);
  const router = useRouter();
  const handleClick = (params, e) => {
    e.stopPropagation();
    if (params.field !== '__check__') {
      router.push(`/backoffice/stocks/${params.row._id}`);
      return;
    }
    setSelectedIds((s) => {
      if (!selectedIds.some((v) => v === params.row._id)) {
        return [...s, params.row._id];
      }
      return s.filter((v) => params.row._id !== v);
    });
  };
  const clickDelete = () => {
    selectedIds.forEach((id) => {
      api.stock.deleteById(id);
    });
  };
  if (!data) return 'loading';
  return (
    <Box>
      {JSON.stringify(selectedIds)}
      <Button onClick={clickDelete}>Delete</Button>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          onCellClick={handleClick}
          rows={data}
          getRowId={(row) => row._id}
          columns={columns}
          checkboxSelection
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>
    </Box>
  );
};

const App = () => {
  return (
    <RecoilRoot>
      <StyledEngineProvider injectFirst>
        <BackofficeLayout>
          <BackofficeStockList />
        </BackofficeLayout>
      </StyledEngineProvider>
    </RecoilRoot>
  );
};

export default App;
