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
import storage from "../../../utils/storage";

const columns = [
  {
    field: "profileImageUrl",
    headerName: "profileImageUrl",
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
  { field: "name", headerName: "name", width: 60 },
  { field: "username", headerName: "username", width: 60 },
  { field: "cash", headerName: "cash", width: 60 },
  { field: "email", headerName: "email", width: 130 },
  { field: "totalAssets", headerName: "totalAssets", width: 40 },
  { field: "totalInvestment", headerName: "totalInvestment", width: 40 },
  { field: "totalProfits", headerName: "totalProfits", width: 40 },
  {
    field: "createdAt",
    headerName: "createdAt",
    type: "date",
    width: 65,
    valueGetter: (params) => new Date(params.value),
  },
  {
    field: "updatedAt",
    headerName: "updatedAt",
    type: "date",
    width: 65,
    valueGetter: (params) => new Date(params.value),
  },
];

const BackofficeIdeaList = () => {
  const { data } = useQuery(["user list"], api.user.get);
  const [selectedIds, setSelectedIds] = useState([]);
  const router = useRouter();
  const handleClick = (params, e) => {
    e.stopPropagation();
    if (params.field !== "__check__") {
      router.push(`/backoffice/users/${params.row._id}`);
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
      api.user.deleteById(id);
    });
  };

  if (!data) return "loading";
  return (
    <Box>
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
          <div>
            <h1>npc login</h1>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await api.auth.npcLogin({
                  id: e.target.id.value,
                  password: e.target.password.value,
                });
                storage.set("access_token", res.accessToken);
                alert("signin success!");
              }}
            >
              <input placeholder="id" name="id" />
              <input placeholder="password" type="password" name="password" />
              <input type="submit" value="login" />
            </form>
          </div>
          <div>
            <h1>custom login</h1>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await api.auth.customLogin({
                  email: e.target.email.value,
                  password: e.target.password.value,
                });
                storage.set("access_token", res.accessToken);
                alert("signin success!");
              }}
            >
              <input placeholder="email" name="email" />
              <input placeholder="password" type="password" name="password" />
              <input type="submit" value="login" />
            </form>
          </div>
          <div>
            <h1>custom signup</h1>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await api.auth.customSignup({
                  email: e.target.email.value,
                  name: e.target.name.value,
                });
                alert("signup success!");
              }}
            >
              <input placeholder="email" name="email" />
              <input placeholder="name" name="name" />
              <input type="submit" value="signup" />
            </form>
          </div>
        </BackofficeLayout>
      </StyledEngineProvider>
    </RecoilRoot>
  );
};

export default App;
