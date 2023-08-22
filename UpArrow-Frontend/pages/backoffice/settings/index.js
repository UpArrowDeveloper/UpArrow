// material-ui
import {
  Box,
  Button,
  Grid,
  StyledEngineProvider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import api from "../../../apis";
import FilePreview from "../../../components/common/FilePreview";
import { env } from "../../../config";
import BackofficeLayout from "../../../Layouts/Backoffice";
import { getYMD } from "../../../utils/date";
import { getUploadUrl } from "../../../utils/file";
import { Boards } from "../../../backoffice/components/settings/Boards";

const BackofficeStockList = () => {
  const { data: config, isLoading } = useQuery(["config"], api.config.get);
  const [bannerImage, setBannerImage] = useState();
  const [boardImage, setBoardImage] = useState();
  const [chartImage, setChartImage] = useState();
  const [name, setName] = useState(config?.board?.name);
  const [color, setColor] = useState(config?.board?.color);
  const [ticker, setTicker] = useState(config?.board?.ticker);
  const [importantDatePrice, setImportantDatePrice] = useState(
    config?.board?.importantDatePrice
  );
  const [importantDateString, setImportantDateString] = useState(
    config?.board?.importantDateString
      ? new Date(config?.board?.importantDateString)
      : undefined
  );
  const [dotLocation, setDotLocation] = useState(
    config?.board?.dotLocation || 0
  );

  const [boards, setBoards] = useState(config?.boards || []);

  useEffect(() => {
    if (!isLoading) {
      setBoards(config?.boards || []);
    }
  }, [isLoading]);

  const save = async () => {
    // if (!bannerImage || !boardImage || !chartImage) return alert("no image");

    const bannerImageUrl = await getUploadUrl(
      bannerImage,
      config?.bannerImageUrl
    );
    const boardImageUrl = await getUploadUrl(
      boardImage,
      config?.board?.imageUrl
    );
    const chartImageUrl = await getUploadUrl(
      chartImage,
      config?.board?.chartImageUrl
    );

    const res = await api.config.put({
      bannerImageUrl,
      board: {
        name,
        color,
        ticker,
        importantDateString,
        importantDatePrice,
        dotLocation,
        imageUrl: boardImageUrl,
        chartImageUrl,
      },
      boards,
    })();
  };
  return (
    <Box>
      <Grid>
        <Typography variant="h3">Banner Image</Typography>
      </Grid>
      <hr></hr>
      <Grid sx={{ marginBottom: 2 }}>
        <Grid>
          <FilePreview file={bannerImage} url={config?.bannerImageUrl} />
        </Grid>
        <Button variant="contained" component="label">
          Upload File
          <input
            type="file"
            id="bannerImage"
            name="bannerImage"
            hidden
            onChange={(e) => {
              setBannerImage(e.target.files[0]);
            }}
          />
        </Button>
      </Grid>
      <Grid>
        <Typography variant="h3">Board</Typography>
      </Grid>
      <hr style={{ marginBottom: 20 }}></hr>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Typography varient="h3">board image</Typography>
          <Grid>
            <FilePreview file={boardImage} url={config?.board?.boardImageUrl} />
          </Grid>
          <Button variant="contained" component="label">
            Upload File
            <input
              type="file"
              id="boardImage"
              name="boardImage"
              hidden
              onChange={(e) => {
                setBoardImage(e.target.files[0]);
              }}
            />
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Typography varient="h3">chart image</Typography>
          <Grid>
            <FilePreview file={chartImage} url={config?.board?.chartImageUrl} />
          </Grid>
          <Grid>
            <Button variant="contained" component="label">
              Upload File
              <input
                type="file"
                id="chartImage"
                name="chartImage"
                hidden
                onChange={(e) => {
                  setChartImage(e.target.files[0]);
                }}
              />
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <TextField
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="name"
            fullWidth
            InputLabelProps={{ shrink: true }}
            autoComplete="family-name"
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />
          <TextField
            id="ticker"
            name="ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            label="ticker"
            fullWidth
            InputLabelProps={{ shrink: true }}
            autoComplete="family-name"
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />
          <TextField
            id="importantDateString"
            name="importantDateString"
            label="thumbnail date"
            value={getYMD(importantDateString || new Date())}
            onChange={(e) => setImportantDateString(new Date(e.target.value))}
            variant="outlined"
            type="date"
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            id="dotLocation"
            name="dotLocation"
            label="dot location"
            value={dotLocation}
            onChange={(e) => setDotLocation(e.target.value)}
            variant="outlined"
            type="number"
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            id="importantDatePrice"
            name="importantDatePrice"
            label="important date price"
            value={importantDatePrice}
            onChange={(e) => setImportantDatePrice(e.target.value)}
            variant="outlined"
            type="number"
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            id="color"
            name="color"
            label="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2 }}
          />
        </Grid>
      </Grid>
      <Boards boards={boards} setBoards={setBoards} />

      <Grid>
        <Button fullWidth size="large" variant="contained" onClick={save}>
          Save
        </Button>
      </Grid>
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
