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
} from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

import Paper from "@mui/material/Paper";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";

import React, { useState } from "react";
import { RecoilRoot } from "recoil";
import api from "../../../apis";
import BackofficeLayout from "../../../Layouts/Backoffice";
import { useRouter } from "next/router";

const columns = [
  {
    field: "thumbnailImageUrl",
    headerName: "thumbnail",
    width: 50,
    type: "image",
    renderCell: (params) => {
      return (
        <>
          {params.value && <Image src={params.value} width={30} height={30} />}
        </>
      );
    },
  },
  { field: "title", headerName: "title", width: 260 },

  {
    field: "commentIds",
    headerName: "commentCount",
    type: "number",
    width: 90,
    valueGetter: (params) => params.value.length,
  },
  {
    field: "createdAt",
    headerName: "createdAt",
    type: "date",
    width: 90,
    valueGetter: (params) => new Date(params.value),
  },
  {
    field: "updatedAt",
    headerName: "updatedAt",
    type: "date",
    width: 90,
    valueGetter: (params) => new Date(params.value),
  },
  {
    field: "updateBtn",
    headerName: "update",
    type: "button",
    width: 90,
    valueGetter: () => "update",
  },
];

const BackofficeIdeaList = () => {
  const { data, refetch } = useQuery(["idea list"], api.idea.get);
  const [selectedIds, setSelectedIds] = useState([]);
  const router = useRouter();
  const handleClick = (params, e) => {
    e.stopPropagation();
    if (params.field === "updateBtn") {
      return router.push(`/editor/${params.id}`);
    }
    if (params.field !== "__check__") {
      router.push(`/idea/${params.row._id}`);
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
    selectedIds.forEach((id, idx) => {
      if (idx === selectedIds.length - 1) {
        api.idea.deleteById(id).then(() => {
          refetch();
        });
        return;
      }
      api.idea.deleteById(id);
    });
  };

  if (!data) return "loading";
  const handleCellClick = (params) => {
    console.log("params : ", params);
  };
  return (
    <Box>
      {JSON.stringify(selectedIds)}
      <Button onClick={() => router.push("/backoffice/stocks/new")}>
        Create
      </Button>
      <Button onClick={clickDelete}>Delete</Button>
      <div style={{ height: 400, width: "100%" }}>
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
          <BackofficeIdeaList />
        </BackofficeLayout>
      </StyledEngineProvider>
    </RecoilRoot>
  );
};

export default App;
