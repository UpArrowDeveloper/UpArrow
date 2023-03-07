import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import { Button, Divider, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { env } from '../../../config';

export const BoStocksMenu = () => {
  const [targetPrices, setTargetPrices] = useState([]);
  const [targetPrice, setTargetPrice] = useState({});

  const [chartName, setChartName] = useState('');
  const [chartValues, setChartValues] = useState([]);
  const [chartValue, setChartValue] = useState({});

  const [financials, setFinancials] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('e.target : ', e.target);
    const name = e.target.name.value;
    const ticker = e.target.ticker.value;
    const currentPrice = e.target.currentPrice.value;
    const logoImage = e.target.stockImage.files?.[0];
    const backgroundImage = e.target.backgroundImage.files?.[0];
    const marketCap = e.target.marketCap.value;

    const logoFormData = new FormData();
    logoFormData.append('image', logoImage);
    const { link: logoUrl } = (
      await axios.post(`${env.serverUrl}/file/upload`, logoFormData)
    ).data;
    const backgroundFormData = new FormData();
    backgroundFormData.append('image', backgroundImage);
    const { link: backgroundImageUrl } = (
      await axios.post(`${env.serverUrl}/file/upload`, backgroundFormData)
    ).data;

    console.log(
      name,
      ticker,
      currentPrice,
      marketCap,
      logoUrl,
      backgroundImageUrl
    );

    await axios.post(`${env.serverUrl}/stock`, {
      name,
      ticker,
      logoUrl,
      backgroundImageUrl,
      currentPrice,
      targetPrices,
    });
  };
  return (
    <form onSubmit={onSubmit}>
      <Typography variant='h6' gutterBottom>
        Add Stock
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id='name'
            name='name'
            label='stock name'
            fullWidth
            variant='standard'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id='ticker'
            name='ticker'
            label='ticker'
            fullWidth
            autoComplete='family-name'
            variant='outlined'
          />
        </Grid>
        <Divider sx={{ width: '100%', mt: 4 }} variant='middle' />
        <Grid item xs={6}>
          <Typography variant='h6' gutterBottom>
            Upload Stock Image
          </Typography>
          <Button variant='contained' component='label'>
            Upload File
            <input type='file' id='stockImage' name='stockImage' hidden />
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Typography variant='h6' gutterBottom>
            Upload Stock Background Image
          </Typography>
          <Button variant='contained' component='label'>
            Upload File
            <input
              type='file'
              id='backgroundImage'
              name='backgroundImage'
              hidden
            />
          </Button>
        </Grid>
        <Divider sx={{ width: '100%', mt: 4 }} variant='middle' />
        <Grid item xs={4}>
          <Typography variant='h6' gutterBottom>
            Price
          </Typography>
          <TextField
            id='currentPrice'
            name='currentPrice'
            label='current price'
            variant='standard'
            type='number'
          />
        </Grid>
        <Grid item xs={4}>
          <Typography variant='h6' gutterBottom>
            Target Prices
          </Typography>
          <TextField
            required
            id='targetPriceName'
            name='targetPriceName'
            label='Name'
            variant='standard'
            value={targetPrice.name || ''}
            onChange={(e) => {
              setTargetPrice((s) => ({ ...s, name: e.target.value }));
            }}
          />
          <TextField
            required
            id='targetPrice'
            name='targetPrice'
            value={targetPrice.price || 0}
            label='Target Price'
            variant='standard'
            sx={{ marginLeft: 2 }}
            type='number'
            min={0}
            onChange={(e) => {
              if (Number(e.target.value) < 0) return;
              setTargetPrice((s) => ({ ...s, price: e.target.value }));
            }}
          />
          <Button
            variant='contained'
            component='label'
            sx={{ marginLeft: 2, marginTop: 2 }}
            disabled={!targetPrice.name || !targetPrice.price}
            onClick={() => {
              setTargetPrices((s) => [...s, { ...targetPrice }]);
              setTargetPrice({});
            }}
          >
            Add
          </Button>
          {targetPrices.map((targetPrice) => (
            <div>
              <span>{targetPrice.name}</span>
              <span>({targetPrice.price})</span>
            </div>
          ))}
        </Grid>
        <Grid item xs={4}>
          <Typography variant='h6' gutterBottom>
            Market Cap
          </Typography>
          <TextField
            id='marketCap'
            name='marketCap'
            label='market cap'
            type='number'
            variant='standard'
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h3' gutterBottom>
            Analyses
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6' gutterBottom>
            Thumbnail
          </Typography>
          <Button variant='contained' component='label'>
            Thumbnail Image Upload
            <input
              type='file'
              id='thumbnailImage'
              name='thumbnailImage'
              hidden
            />
          </Button>
          <TextField
            id='thumbnailTitle'
            name='thumbnailTitle'
            label='thumbnail title'
            variant='standard'
            sx={{ marginLeft: 2 }}
          />
          <TextField
            id='thumbnailDate'
            name='thumbnailDate'
            label='thumbnail date'
            variant='outlined'
            type='date'
            InputLabelProps={{ shrink: true }}
            sx={{ marginLeft: 2 }}
          />
        </Grid>
        <Grid item xs={4}>
          <Typography variant='h6' gutterBottom>
            missionStatement
          </Typography>
          <TextField
            id='missionStatement'
            name='missionStatement'
            label='missionStatement'
            variant='outlined'
            multiline
            fullWidth
            rows={6}
          />
        </Grid>
        <Grid item xs={4}>
          <Typography variant='h6' gutterBottom>
            businessModel
          </Typography>
          <TextField
            id='businessModel'
            name='businessModel'
            label='businessModel'
            variant='outlined'
            multiline
            fullWidth
            rows={6}
          />
        </Grid>
        <Grid item xs={4}>
          <Typography variant='h6' gutterBottom>
            Competitive Advantages
          </Typography>
          <TextField
            id='competitiveAdvantage'
            name='competitiveAdvantage'
            label='Competitive Advantages'
            variant='outlined'
            multiline
            fullWidth
            rows={6}
          />
        </Grid>
        <Grid item xs={4}>
          <Typography variant='h6' gutterBottom>
            Growth Opportunities
          </Typography>
          <TextField label='Growth Opportunities' variant='outlined' />
          <Button variant='contained'>Add</Button>
        </Grid>
        <Grid item xs={8}>
          <Typography variant='h6' gutterBottom>
            Potential Risks
          </Typography>
          <TextField label='Potential Risks' variant='outlined' />
          <Button variant='contained'>Add</Button>
        </Grid>
        <Grid item xs={8}>
          <Typography variant='h6' gutterBottom>
            Financials
          </Typography>
          <TextField
            label='name'
            variant='outlined'
            value={chartName}
            onChange={(e) => setChartName(e.target.value)}
          />
          <TextField
            required
            label='year'
            variant='standard'
            value={chartValue.year || 0}
            type='number'
            onChange={(e) => {
              if (Number(e.target.value) < 0) return;
              setChartValue((s) => ({ ...s, year: Number(e.target.value) }));
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            required
            value={chartValue.value || 0}
            label='value'
            variant='standard'
            sx={{ marginLeft: 2 }}
            InputLabelProps={{ shrink: true }}
            type='number'
            onChange={(e) => {
              if (Number(e.target.value) < 0) return;
              setChartValue((s) => ({ ...s, value: Number(e.target.value) }));
            }}
          />
          <Button
            variant='contained'
            component='label'
            sx={{ marginLeft: 2, marginTop: 2 }}
            disabled={!chartValue.year || !chartValue.value}
            onClick={() => {
              setChartValues((s) => [...s, { ...chartValue }]);
              setChartValue({});
            }}
          >
            Add
          </Button>

          <Button
            variant='contained'
            disabled={!chartName || chartValues.length === 0}
            onClick={() => {
              if (!chartName) return;
              setFinancials((s) => [...s, { name: chartName, chartValues }]);
              setChartValues([]);
              setChartName('');
            }}
          >
            Add
          </Button>
          {chartValues.map((cv) => (
            <div>
              year : {cv.year} value : {cv.value}
            </div>
          ))}
        </Grid>
        <Grid item xs={4}>
          <Typography variant='h6' gutterBottom>
            Financials
          </Typography>
          {financials.map((cv) => (
            <div>
              <Typography variant='h6'>{cv.name}</Typography>
              {cv.chartValues.map((cvv) => JSON.stringify(cvv))}
            </div>
          ))}
        </Grid>
        <Grid item xs={12}>
          <Button variant='contained' type='submit' fullWidth>
            Add Stock
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
